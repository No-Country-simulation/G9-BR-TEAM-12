"""
Módulo de carregamento do modelo de Machine Learning — model_loader.py

Responsabilidade única: resolver a FONTE do modelo (.pkl) e devolvê-lo
já desserializado e pronto para uso no startup da FastAPI.

Fontes suportadas (variável de ambiente MODEL_SOURCE):
  • "local" (default) — lê o arquivo .pkl do sistema de arquivos via joblib.
  • "oci"             — baixa o objeto do OCI Object Storage via SDK e carrega com joblib.

Autenticação OCI (cascata, sem credenciais no código):
  1. ~/.oci/config         — ambiente local / developer (se o arquivo existir)
  2. Resource Principal    — OCI Functions, Container Instances (se OCI_RESOURCE_PRINCIPAL_VERSION definida)
  3. Instance Principal    — OCI Compute com Dynamic Group (fallback)
"""

from __future__ import annotations

import io
import os
import logging
from typing import Any

import joblib  # type: ignore[import-not-found]

logger = logging.getLogger("model_loader")

# ---------------------------------------------------------------------------
# Variáveis de ambiente com valores padrão seguros
# ---------------------------------------------------------------------------
MODEL_SOURCE: str = os.getenv("MODEL_SOURCE", "local")
MODEL_LOCAL_PATH: str = os.getenv("MODEL_LOCAL_PATH", "models/modelo_energiai_v1.pkl")

OCI_REGION: str = os.getenv("OCI_REGION", "sa-saopaulo-1")
OCI_NAMESPACE: str = os.getenv("OCI_NAMESPACE", "grclodnfw2hl")
OCI_BUCKET: str = os.getenv("OCI_OBJECT_STORAGE_BUCKET", "powerpolis-bucket-models")
OCI_OBJECT_NAME: str = os.getenv("OCI_MODEL_OBJECT_NAME", "models/modelo_energiai_v1.pkl")

# Caminhos alternativos legados (compatibilidade com estrutura anterior)
_FALLBACK_PATHS: list[str] = [
    "models/modelo_energiai_v1.pkl",
    "../models/modelo_energiai_v1.pkl",
    "app/models/modelo_energiai_v1.pkl",
]


# ---------------------------------------------------------------------------
# Carregamento LOCAL
# ---------------------------------------------------------------------------
def _load_local() -> Any:
    """
    Carrega o modelo .pkl do sistema de arquivos local.

    Tenta primeiro o caminho configurado em MODEL_LOCAL_PATH.
    Se não existir, percorre os caminhos legados de fallback.
    """
    caminhos = [MODEL_LOCAL_PATH] + [
        p for p in _FALLBACK_PATHS if p != MODEL_LOCAL_PATH
    ]

    for caminho in caminhos:
        if os.path.exists(caminho):
            modelo = joblib.load(caminho)
            logger.info("[OK] Modelo carregado localmente de: %s", caminho)
            return modelo
        logger.debug("Caminho inexistente: %s", caminho)

    raise FileNotFoundError(
        f"Nenhum arquivo de modelo encontrado. Caminhos testados: {caminhos}"
    )


# ---------------------------------------------------------------------------
# Autenticação OCI (cascata)
# ---------------------------------------------------------------------------
def _build_oci_client() -> Any:
    """
    Constrói um ObjectStorageClient autenticado seguindo a cascata:
      1. ~/.oci/config  (desenvolvimento local)
      2. Resource Principal  (OCI Functions / Container Instances)
      3. Instance Principal  (OCI Compute com Dynamic Group)

    Nunca lê credenciais hardcoded; depende exclusivamente do ambiente.
    """
    # Importações tardias — o pacote 'oci' só é necessário quando MODEL_SOURCE=oci
    import oci  # type: ignore[import-not-found]

    # 1. Config file local (~/.oci/config)
    config_path = os.path.expanduser("~/.oci/config")
    if os.path.exists(config_path):
        logger.info("Autenticação OCI via config file: %s", config_path)
        config = oci.config.from_file(config_path)
        return oci.object_storage.ObjectStorageClient(config)

    # 2. Resource Principal (OCI Functions, Container Instances)
    if os.getenv("OCI_RESOURCE_PRINCIPAL_VERSION"):
        logger.info("Autenticação OCI via Resource Principal")
        signer = oci.auth.signers.get_resource_principals_signer()
        return oci.object_storage.ObjectStorageClient({}, signer=signer)

    # 3. Instance Principal (Compute com Dynamic Group)
    logger.info("Autenticação OCI via Instance Principal")
    try:
        signer = oci.auth.signers.InstancePrincipalsSecurityTokenSigner()
        return oci.object_storage.ObjectStorageClient({}, signer=signer)
    except Exception as exc:
        raise RuntimeError(
            "Falha na autenticação OCI. Nenhum método disponível "
            "(~/.oci/config, Resource Principal, Instance Principal). "
            f"Detalhes: {exc}"
        ) from exc


# ---------------------------------------------------------------------------
# Carregamento OCI
# ---------------------------------------------------------------------------
def _load_from_oci() -> Any:
    """
    Baixa o modelo do OCI Object Storage e o desserializa com joblib.

    O download ocorre inteiramente em memória (io.BytesIO) — nenhum
    arquivo temporário é gravado em disco.
    """
    client = _build_oci_client()

    logger.info(
        "Baixando modelo do OCI Object Storage: "
        "namespace=%s, bucket=%s, object=%s",
        OCI_NAMESPACE, OCI_BUCKET, OCI_OBJECT_NAME,
    )

    response = client.get_object(
        namespace_name=OCI_NAMESPACE,
        bucket_name=OCI_BUCKET,
        object_name=OCI_OBJECT_NAME,
    )

    buffer = io.BytesIO(response.data.content)
    modelo = joblib.load(buffer)

    logger.info("[OK] Modelo carregado com sucesso do OCI Object Storage.")
    return modelo


# ---------------------------------------------------------------------------
# Função pública (ponto de entrada único)
# ---------------------------------------------------------------------------
def load_model() -> Any:
    """
    Ponto de entrada único para carregamento do modelo.

    Retorna o modelo desserializado pronto para .predict() e .predict_proba().
    Levanta exceção se o carregamento falhar (a FastAPI deve tratar no lifespan).
    """
    source = MODEL_SOURCE.strip().lower()
    logger.info("MODEL_SOURCE=%s — iniciando carregamento do modelo...", source)

    if source == "local":
        return _load_local()
    elif source == "oci":
        return _load_from_oci()
    else:
        raise ValueError(
            f"MODEL_SOURCE inválido: '{source}'. Valores aceitos: 'local', 'oci'."
        )
