
class Pago():
    def __init__(self, forma_pago: str, estado_pago: str, codigo_pago: int, monto: float):
        self.id_pago = None  # ID asignado por la base de datos --- IGNORE ---
        self.forma_pago = forma_pago  # "efectivo" o "tarjeta"
        self.estado_pago = estado_pago  # "PAGO_A_REALIZAR_EN_CAJA", "PAGO_EXITOSO_POR_TARJETA_EN_MERCADO_PAGO", etc.
        self.codigo_pago = codigo_pago  # Código de pago generado por el sistema de pago (si aplica)
        self.monto = monto # Monto total del pago