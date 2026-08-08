FROM python:3.11-slim

WORKDIR /app

# Copiar arquivo de dependências e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código-fonte e pasta de modelos
COPY src ./src
COPY models ./models

# Expor a porta 8000 para comunicação na rede
EXPOSE 8000

# Comando para iniciar o servidor Uvicorn no container
CMD ["uvicorn", "src.model_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
