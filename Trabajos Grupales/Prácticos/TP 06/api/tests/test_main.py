from fastapi.testclient import TestClient
from app.main import app

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


