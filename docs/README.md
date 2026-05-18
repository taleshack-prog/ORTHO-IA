# ORTO-IA — Plataforma de Diagnóstico Ortodôntico Assistido por IA

**Hack Tech Farm · 2026**

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Backend | FastAPI 0.136 (Python 3.11) + SQLAlchemy 2.0 |
| Banco | PostgreSQL 15 + pgvector |
| Filas | Redis 7 + Celery 5.6 |
| IA | Claude Sonnet (Anthropic) |
| Cloud | AWS S3 + CloudFront |

## Início Rápido

```bash
# 1. Configurar variáveis
cp .env.example .env
# Editar .env: adicionar ANTHROPIC_API_KEY

# 2. Subir infraestrutura (da raiz do projeto)
docker compose up -d

# 3. Verificar
docker compose ps
curl http://localhost:8000/health

# 4. Acessar
# API Docs: http://localhost:8000/docs
# Frontend: http://localhost:3000
```

## Portas

| Serviço | Porta |
|---------|-------|
| Frontend | 3000 |
| Backend API | 8000 |
| PostgreSQL | 5436 |
| Redis | 6380 |
| Flower (filas) | 5555 |

## Autores da Knowledge Base

Steiner · McNamara · Tweed · Ricketts · Interlandi · Nanda · Downs · Angle

## Firewall Clínico (8 Regras Imutáveis)

| # | Regra |
|---|-------|
| R1 | ANB < -2° → Classe III obrigatória |
| R2 | FMA > 32° + extrações → ancoragem máxima |
| R3 | IMPA > 100° → protrusão na lista de problemas |
| R4 | Wits < -2mm confirma Classe III |
| R5 | 1.NA > 4mm → incisivos superiores na lista |
| R6 | Padrão facial consistente com FMA |
| R7 | Extração correlacionada com Little's Index |
| R8 | ANB < -4° ou > 7° ou FMA > 35° → avaliação cirúrgica |
