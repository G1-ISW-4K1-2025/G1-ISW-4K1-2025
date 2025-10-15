from fastapi.testclient import TestClient
from app.main import app
import pytest
from datetime import date, timedelta


client = TestClient(app)

def test_read_root():
    resp = client.get("/")
    assert resp.json() == {"message": "Hola, somos el grupo 1 de la materia ISW!"}


# Usuario no autenticado
def test_compra_con_usuario_no_registrado_falla():
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=25, tipo_pase="Regular", precio=100)
    with pytest.raises(ValidacionError):
        Compra(fecha=date.today(), forma_de_pago="tarjeta", entradas=[entrada], precio_total=100, usuario=None)

# Fecha anterior a hoy
def test_compra_con_fecha_pasada_falla():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    fecha_pasada = date.today() - timedelta(days=3)
    entrada = Entrada(fecha_visita=fecha_pasada, edad_visitante=30, tipo_pase="Regular", precio=100)
    with pytest.raises(ValidacionError):
        Compra(fecha=fecha_pasada, forma_de_pago="tarjeta", entradas=[entrada], precio_total=100, usuario=usuario)

# Falta edad de los visitantes
def test_compra_sin_edad_de_visitantes_falla():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=None, tipo_pase="Regular", precio=100)
    with pytest.raises(ValidacionError):
        Compra(fecha=date.today(), forma_de_pago="tarjeta", entradas=[entrada], precio_total=100, usuario=usuario)

# Menos visitantes que entradas
def test_compra_con_menos_visitantes_que_entradas_falla():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    edades = [25, 30]  # pero supongamos que pidió 3 entradas
    entradas = [Entrada(fecha_visita=date.today(), edad_visitante=e, tipo_pase="Regular", precio=100) for e in edades]
    with pytest.raises(ValidacionError):
        #Cantidad pedida (3) y edades (2)
        Compra(fecha=date.today(), forma_de_pago="tarjeta", entradas=entradas, precio_total=300, usuario=usuario)

# Visitante con edad negativa
def test_compra_con_edad_negativa_falla():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=-5, tipo_pase="Regular", precio=100)
    with pytest.raises(ValidacionError):
        Compra(fecha=date.today(), forma_de_pago="tarjeta", entradas=[entrada], precio_total=100, usuario=usuario)