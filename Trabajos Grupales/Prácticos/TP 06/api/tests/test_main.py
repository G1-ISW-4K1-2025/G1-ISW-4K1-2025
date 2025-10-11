from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    resp = client.get("/")
    assert resp.json() == {"message": "Hola, somos el grupo 1 de la materia ISW!"}


