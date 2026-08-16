"""
Testes unitários do módulo model_loader.py

Todos os testes usam unittest.mock para simular o OCI SDK e o sistema de arquivos.
Não requerem conectividade real com a OCI nem um arquivo .pkl real.
"""

import io
import os
from unittest.mock import MagicMock, patch, PropertyMock

import pytest


# ---------------------------------------------------------------------------
# Fixtures e helpers
# ---------------------------------------------------------------------------
FAKE_MODEL = MagicMock(name="FakeRandomForestModel")


def _make_oci_response(content: bytes) -> MagicMock:
    """Cria um mock da resposta do OCI ObjectStorageClient.get_object()."""
    response = MagicMock()
    response.data.content = content
    return response


# ---------------------------------------------------------------------------
# Testes: Carregamento LOCAL
# ---------------------------------------------------------------------------
class TestLoadLocal:
    """Testes para MODEL_SOURCE=local."""

    @patch.dict(os.environ, {"MODEL_SOURCE": "local", "MODEL_LOCAL_PATH": "/fake/model.pkl"})
    @patch("src.model_service.model_loader.os.path.exists", return_value=True)
    @patch("src.model_service.model_loader.joblib.load", return_value=FAKE_MODEL)
    def test_load_local_primary_path(self, mock_load, mock_exists):
        """Deve carregar do caminho primário quando o arquivo existe."""
        from src.model_service.model_loader import _load_local

        # Recarrega variáveis do módulo
        with patch("src.model_service.model_loader.MODEL_LOCAL_PATH", "/fake/model.pkl"):
            modelo = _load_local()

        mock_load.assert_called_once_with("/fake/model.pkl")
        assert modelo is FAKE_MODEL

    @patch.dict(os.environ, {"MODEL_SOURCE": "local", "MODEL_LOCAL_PATH": "/not/here.pkl"})
    @patch("src.model_service.model_loader.joblib.load", return_value=FAKE_MODEL)
    def test_load_local_fallback_paths(self, mock_load):
        """Deve percorrer caminhos de fallback quando o primário não existe."""
        from src.model_service.model_loader import _load_local

        def exists_side_effect(path):
            return path == "models/modelo_energiai_v1.pkl"

        with patch("src.model_service.model_loader.os.path.exists", side_effect=exists_side_effect):
            with patch("src.model_service.model_loader.MODEL_LOCAL_PATH", "/not/here.pkl"):
                modelo = _load_local()

        mock_load.assert_called_once_with("models/modelo_energiai_v1.pkl")
        assert modelo is FAKE_MODEL

    @patch.dict(os.environ, {"MODEL_SOURCE": "local"})
    @patch("src.model_service.model_loader.os.path.exists", return_value=False)
    def test_load_local_file_not_found(self, mock_exists):
        """Deve levantar FileNotFoundError quando nenhum caminho existe."""
        from src.model_service.model_loader import _load_local

        with pytest.raises(FileNotFoundError, match="Nenhum arquivo de modelo encontrado"):
            _load_local()


# ---------------------------------------------------------------------------
# Testes: Autenticação OCI
# ---------------------------------------------------------------------------
class TestBuildOciClient:
    """Testes para a cascata de autenticação OCI."""

    @patch("src.model_service.model_loader.os.path.exists", return_value=True)
    @patch("src.model_service.model_loader.os.path.expanduser", return_value="/home/user/.oci/config")
    def test_auth_config_file(self, mock_expand, mock_exists):
        """Deve usar ~/.oci/config quando o arquivo existe."""
        mock_oci = MagicMock()
        mock_client_instance = MagicMock()
        mock_oci.config.from_file.return_value = {"region": "sa-saopaulo-1"}
        mock_oci.object_storage.ObjectStorageClient.return_value = mock_client_instance

        with patch.dict("sys.modules", {"oci": mock_oci, "oci.config": mock_oci.config,
                                         "oci.object_storage": mock_oci.object_storage}):
            from src.model_service.model_loader import _build_oci_client
            client = _build_oci_client()

        mock_oci.config.from_file.assert_called_once_with("/home/user/.oci/config")
        assert client is mock_client_instance

    @patch.dict(os.environ, {"OCI_RESOURCE_PRINCIPAL_VERSION": "2.2"})
    @patch("src.model_service.model_loader.os.path.exists", return_value=False)
    @patch("src.model_service.model_loader.os.path.expanduser", return_value="/home/user/.oci/config")
    def test_auth_resource_principal(self, mock_expand, mock_exists):
        """Deve usar Resource Principal quando OCI_RESOURCE_PRINCIPAL_VERSION está definida."""
        mock_oci = MagicMock()
        mock_signer = MagicMock()
        mock_client_instance = MagicMock()
        mock_oci.auth.signers.get_resource_principals_signer.return_value = mock_signer
        mock_oci.object_storage.ObjectStorageClient.return_value = mock_client_instance

        with patch.dict("sys.modules", {"oci": mock_oci, "oci.auth": mock_oci.auth,
                                         "oci.auth.signers": mock_oci.auth.signers,
                                         "oci.object_storage": mock_oci.object_storage}):
            from src.model_service.model_loader import _build_oci_client
            client = _build_oci_client()

        mock_oci.auth.signers.get_resource_principals_signer.assert_called_once()
        mock_oci.object_storage.ObjectStorageClient.assert_called_once_with({}, signer=mock_signer)
        assert client is mock_client_instance

    @patch.dict(os.environ, {}, clear=False)
    @patch("src.model_service.model_loader.os.path.exists", return_value=False)
    @patch("src.model_service.model_loader.os.path.expanduser", return_value="/home/user/.oci/config")
    def test_auth_instance_principal(self, mock_expand, mock_exists):
        """Deve usar Instance Principal como fallback final."""
        # Remove a variável de ambiente caso esteja definida
        env_clean = {k: v for k, v in os.environ.items() if k != "OCI_RESOURCE_PRINCIPAL_VERSION"}

        mock_oci = MagicMock()
        mock_signer = MagicMock()
        mock_client_instance = MagicMock()
        mock_oci.auth.signers.InstancePrincipalsSecurityTokenSigner.return_value = mock_signer
        mock_oci.object_storage.ObjectStorageClient.return_value = mock_client_instance

        with patch.dict(os.environ, env_clean, clear=True):
            with patch.dict("sys.modules", {"oci": mock_oci, "oci.auth": mock_oci.auth,
                                             "oci.auth.signers": mock_oci.auth.signers,
                                             "oci.object_storage": mock_oci.object_storage}):
                from src.model_service.model_loader import _build_oci_client
                client = _build_oci_client()

        mock_oci.auth.signers.InstancePrincipalsSecurityTokenSigner.assert_called_once()
        assert client is mock_client_instance

    @patch.dict(os.environ, {}, clear=False)
    @patch("src.model_service.model_loader.os.path.exists", return_value=False)
    @patch("src.model_service.model_loader.os.path.expanduser", return_value="/home/user/.oci/config")
    def test_auth_all_fail_raises_runtime_error(self, mock_expand, mock_exists):
        """Deve levantar RuntimeError quando todas as formas de autenticação falham."""
        env_clean = {k: v for k, v in os.environ.items() if k != "OCI_RESOURCE_PRINCIPAL_VERSION"}

        mock_oci = MagicMock()
        mock_oci.auth.signers.InstancePrincipalsSecurityTokenSigner.side_effect = Exception("No metadata service")

        with patch.dict(os.environ, env_clean, clear=True):
            with patch.dict("sys.modules", {"oci": mock_oci, "oci.auth": mock_oci.auth,
                                             "oci.auth.signers": mock_oci.auth.signers,
                                             "oci.object_storage": mock_oci.object_storage}):
                from src.model_service.model_loader import _build_oci_client

                with pytest.raises(RuntimeError, match="Falha na autenticação OCI"):
                    _build_oci_client()


# ---------------------------------------------------------------------------
# Testes: Carregamento OCI
# ---------------------------------------------------------------------------
class TestLoadFromOci:
    """Testes para MODEL_SOURCE=oci."""

    @patch("src.model_service.model_loader._build_oci_client")
    @patch("src.model_service.model_loader.joblib.load", return_value=FAKE_MODEL)
    def test_load_from_oci_success(self, mock_joblib_load, mock_build_client):
        """Deve baixar o objeto do OCI e desserializar com joblib."""
        fake_content = b"fake-pkl-bytes"
        mock_client = MagicMock()
        mock_client.get_object.return_value = _make_oci_response(fake_content)
        mock_build_client.return_value = mock_client

        from src.model_service.model_loader import _load_from_oci, OCI_NAMESPACE, OCI_BUCKET, OCI_OBJECT_NAME

        modelo = _load_from_oci()

        mock_client.get_object.assert_called_once_with(
            namespace_name=OCI_NAMESPACE,
            bucket_name=OCI_BUCKET,
            object_name=OCI_OBJECT_NAME,
        )
        # Verifica que joblib.load foi chamado com um BytesIO contendo o conteúdo correto
        call_args = mock_joblib_load.call_args[0][0]
        assert isinstance(call_args, io.BytesIO)
        call_args.seek(0)
        assert call_args.read() == fake_content
        assert modelo is FAKE_MODEL


# ---------------------------------------------------------------------------
# Testes: Função pública load_model()
# ---------------------------------------------------------------------------
class TestLoadModel:
    """Testes para a função de entrada pública load_model()."""

    @patch("src.model_service.model_loader._load_local", return_value=FAKE_MODEL)
    @patch("src.model_service.model_loader.MODEL_SOURCE", "local")
    def test_load_model_local(self, mock_load_local):
        """Deve delegar para _load_local quando MODEL_SOURCE=local."""
        from src.model_service.model_loader import load_model

        modelo = load_model()
        mock_load_local.assert_called_once()
        assert modelo is FAKE_MODEL

    @patch("src.model_service.model_loader._load_from_oci", return_value=FAKE_MODEL)
    @patch("src.model_service.model_loader.MODEL_SOURCE", "oci")
    def test_load_model_oci(self, mock_load_oci):
        """Deve delegar para _load_from_oci quando MODEL_SOURCE=oci."""
        from src.model_service.model_loader import load_model

        modelo = load_model()
        mock_load_oci.assert_called_once()
        assert modelo is FAKE_MODEL

    @patch("src.model_service.model_loader.MODEL_SOURCE", "invalid_source")
    def test_load_model_invalid_source(self):
        """Deve levantar ValueError para MODEL_SOURCE inválido."""
        from src.model_service.model_loader import load_model

        with pytest.raises(ValueError, match="MODEL_SOURCE inválido"):
            load_model()
