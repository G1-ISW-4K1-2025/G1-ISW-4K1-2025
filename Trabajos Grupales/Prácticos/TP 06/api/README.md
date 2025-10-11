# API TP 06

## Requisitos
- Python 3.11 o 3.12
- Ejecutar comandos en bash

**Ir a la carpeta del proyecto**

    cd "G1-ISW-4K1-2025/Trabajos Grupales/Prácticos/TP 06/api

**Crear y activar entorno virtual** (ejecutar estos 2 comandos)

    python3 -m venv .venv

    source .venv/bin/activate

**Instalar dependencias**

    python -m pip install -r requirements.txt

**Ejecutar tests**

    python -m pytest -q

**Levantar servidor de desarrollo**

    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## Endpoints

- `GET /` → saludo JSON

