from fastapi.testclient import TestClient
from app.main import app
import pytest
from datetime import date, timedelta


client = TestClient(app)

def test_read_root():
    resp = client.get("/")
    assert resp.json() == {"message": "Hola, somos el grupo 1 de la materia ISW!"}

# Compra exitosa con datos válidos
def test_compra_exitosa_con_datos_validos():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entradas = [
        Entrada(fecha_visita=date.today(), edad_visitante=25, tipo_pase="Regular", precio=100),
        Entrada(fecha_visita=date.today(), edad_visitante=30, tipo_pase="Regular", precio=100)
    ]
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="tarjeta",
        entradas=entradas,
        precio_total=200,
        usuario=usuario
    )
    assert compra.usuario.mail == "ana@example.com"
    assert len(compra.entradas) == 2
    assert compra.precio_total == 200

# Compra con fecha actual
def test_compra_con_fecha_actual():
    usuario = Usuario(mail="juan@example.com", contraseña="1234")
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=22, tipo_pase="Regular", precio=100)
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="efectivo",
        entradas=[entrada],
        precio_total=100,
        usuario=usuario
    )
    assert compra.fecha == date.today()

# Compra con fecha futura
def test_compra_con_fecha_futura():
    usuario = Usuario(mail="luis@example.com", contraseña="1234")
    fecha_futura = date.today() + timedelta(days=5)
    entrada = Entrada(fecha_visita=fecha_futura, edad_visitante=40, tipo_pase="VIP", precio=200)
    compra = Compra(
        fecha=fecha_futura,
        forma_de_pago="tarjeta",
        entradas=[entrada],
        precio_total=200,
        usuario=usuario
    )
    assert compra.fecha == fecha_futura
    assert all(e.fecha_visita == fecha_futura for e in compra.entradas)

# Compra con tarjeta → redirige a Mercado Pago (simulado)
def test_compra_con_tarjeta_redirige_a_mercadopago(monkeypatch):
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=28, tipo_pase="Regular", precio=100)

    def mock_redirigir_a_pago(forma_de_pago):
        if forma_de_pago == "tarjeta":
            return "https://mercadopago.com/pago123"

    monkeypatch.setattr("modelos.Compra.redirigir_a_pago", mock_redirigir_a_pago)
    
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="tarjeta",
        entradas=[entrada],
        precio_total=100,
        usuario=usuario
    )

    url_pago = compra.redirigir_a_pago(compra.forma_de_pago)
    assert "mercadopago" in url_pago

# Envío de mail de confirmación después de la compra (simulado)
def test_envio_mail_confirmacion_despues_de_compra(monkeypatch):
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entrada = Entrada(fecha_visita=date.today(), edad_visitante=27, tipo_pase="Regular", precio=100)
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="tarjeta",
        entradas=[entrada],
        precio_total=100,
        usuario=usuario
    )

    mail_enviado = {}

    def mock_enviar_mail_confirmacion(usuario, compra):
        mail_enviado["ok"] = True
        mail_enviado["destinatario"] = usuario.mail

    monkeypatch.setattr("modelos.Compra.enviar_mail_confirmacion", mock_enviar_mail_confirmacion)

    compra.enviar_mail_confirmacion(usuario, compra)

    assert mail_enviado["ok"] is True
    assert mail_enviado["destinatario"] == "ana@example.com"


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


# Resumen de compra al finalizar
def test_resumen_compra_al_finalizar():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entradas = [
        Entrada(fecha_visita=date.today(), edad_visitante=20, tipo_pase="Regular", precio=100),
        Entrada(fecha_visita=date.today(), edad_visitante=25, tipo_pase="Regular", precio=100)
    ]
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="tarjeta",
        entradas=entradas,
        precio_total=200,
        usuario=usuario
    )

    resumen = f"Compra de {len(compra.entradas)} entradas para el {compra.fecha}"
    assert "2 entradas" in resumen
    assert str(date.today()) in resumen

# Compra con 10 entradas (límite permitido)
def test_compra_con_diez_entradas_limite_permitido():
    usuario = Usuario(mail="ana@example.com", contraseña="1234")
    entradas = [
        Entrada(fecha_visita=date.today(), edad_visitante=30, tipo_pase="Regular", precio=100)
        for _ in range(10)
    ]
    compra = Compra(
        fecha=date.today(),
        forma_de_pago="efectivo",
        entradas=entradas,
        precio_total=1000,
        usuario=usuario
    )
    assert len(compra.entradas) == 10
    assert compra.precio_total == 1000
