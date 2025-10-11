# API TP 06

## Requisitos
- Python 3.11 o 3.12

**Ir a la carpeta del proyecto**
    ```bash··
    cd "G1-ISW-4K1-2025/Trabajos Grupales/Prácticos/TP 06/api"
    ```

**Crear y activar entorno virtual** (ejecutar estos 2 comandos)
    ```bash··
    python3 -m venv .venv··
    source .venv/bin/activate
    ```

**Instalar dependencias**
    ```bash··
    python -m pip install -r requirements.txt
    ```

**Ejecutar tests**
    ```bash··
    python -m pytest -q
    ```

**Levantar servidor de desarrollo**
    ```bash··
    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
    ```

## Endpoints
- `GET /` → saludo JSON

