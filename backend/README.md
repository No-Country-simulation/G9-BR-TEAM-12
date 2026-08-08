# Este arquivo tem como objetivo instruir a rodar e atualizar o Docker do backend 
## Requisitos

- Docker Desktop instalado
- WSL2 configurado (Windows)

---

## Construindo a imagem

Dentro da pasta **backend**, execute:

```bash
docker build -t backend-powerpolis .
```

---

## Executando o container

```bash
docker run --name backend-powerpolis-container -p 9091:9091 backend-powerpolis
```

A aplicação ficará disponível em:

```
http://localhost:9091
```

---

## Comandos úteis

### Ver containers em execução

```bash
docker ps
```

### Ver todos os containers

```bash
docker ps -a
```

### Visualizar logs

```bash
docker logs backend-powerpolis-container
```

### Iniciar um container existente

```bash
docker start backend-powerpolis-container
```

### Parar o container

```bash
docker stop backend-powerpolis-container
```

### Remover o container

```bash
docker rm backend-powerpolis-container
```

---

# Atualizando a aplicação após alterações no IntelliJ

> **Importante:** O Docker não atualiza automaticamente quando o código é alterado no IntelliJ.

Sempre que houver alterações no código Java, é necessário reconstruir a imagem e criar um novo container.

### 1. Reconstruir a imagem

```bash
docker build -t backend-powerpolis .
```

### 2. Parar o container antigo

```bash
docker stop backend-powerpolis-container
```

### 3. Remover o container antigo

```bash
docker rm backend-powerpolis-container
```

### 4. Criar um novo container

```bash
docker run --name backend-powerpolis-container -p 9091:9091 backend-powerpolis
```

Após esses passos, o container utilizará a versão mais recente da aplicação.

---

## Observações

- A aplicação utiliza a porta **9091**.