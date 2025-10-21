from datetime import date
from .entrada import Entrada
from .validacionError import ValidacionError
from .usuario import Usuario
from .repositorioCompraEntradas import RepositorioCompraEntradas

class ServicioCompraEntradas:
    """
    Servicio que implementa la funcionalidad de compra de entradas
    según la User Story 8 de EcoHarmony Park
    """

    def __init__(self):
        self.dias_abierto = [0, 1, 2, 3, 4, 5]  # Lunes a Sábado [1, 2, 3, 4, 5, 6]
        self.repositorio = RepositorioCompraEntradas()
        self.max_entradas = 10
        self.min_entradas = 1
        self.formas_pago_validas = ["efectivo", "tarjeta"]
        self.tipos_pase_validos = ["VIP", "Regular"]

    def _validar_forma_pago(self, forma_pago: str) -> str:
        """Valida y normaliza la forma de pago."""
        if not forma_pago or not isinstance(forma_pago, str):
            raise ValidacionError("La forma de pago es requerida")

        forma_pago = forma_pago.lower().strip()
        if forma_pago not in self.formas_pago_validas:
            raise ValidacionError(f"Debe seleccionar una forma de pago válida: {', '.join(self.formas_pago_validas)}")

        return forma_pago

    def _validar_fecha_visita(self, fecha_visita: str) -> date:
        """Valida que la fecha de visita sea válida."""
        try:
            fecha = date.fromisoformat(fecha_visita)
        except ValueError:
            raise ValidacionError("Formato de fecha inválido. Use YYYY-MM-DD")

        if fecha < date.today():
            raise ValidacionError("La fecha de visita no puede ser anterior a hoy")

        if fecha.weekday() not in self.dias_abierto:
            raise ValidacionError("El parque está cerrado en la fecha seleccionada")

        return fecha

    def _validar_cantidad_entradas(self, cantidad: int) -> bool:
        """Valida la cantidad de entradas."""
        if cantidad < self.min_entradas:
            raise ValidacionError(f"Debe solicitar al menos {self.min_entradas} entrada")

        if cantidad > self.max_entradas:
            raise ValidacionError(f"La cantidad de entradas no puede ser mayor a {self.max_entradas}")

        return True

    def _validar_usuario_registrado(self, usuario_id: int) -> Usuario:
        """Valida que el usuario esté registrado."""
        if not usuario_id or usuario_id <= 0:
            raise ValidacionError("ID de usuario inválido")

        try:
            usuario = self.repositorio.obtener_usuario_por_id(usuario_id)
            if not usuario:
                raise ValidacionError("El usuario no está registrado")
            return usuario
        except Exception as e:
            raise ValidacionError(f"Error al validar usuario: {str(e)}")

    def _validar_entrada_completa(self, entrada: Entrada) -> bool:
        """Valida todos los campos de una entrada."""
        if not entrada:
            raise ValidacionError("La entrada no puede ser nula")

        if not isinstance(entrada.edad_visitante, int):
            raise ValidacionError("La edad del visitante debe ser un número entero")

        # Validar edad
        if entrada.edad_visitante < 0:
            raise ValidacionError("La edad del visitante no puede ser negativa")

        if entrada.edad_visitante > 120:
            raise ValidacionError("La edad del visitante no es válida")

        # Validar tipo de pase
        if entrada.tipo_pase not in self.tipos_pase_validos:
            raise ValidacionError(f"El tipo de pase debe ser uno de: {', '.join(self.tipos_pase_validos)}")

        # Validar precio
        if entrada.precio < 0:
            raise ValidacionError("El precio de la entrada no puede ser negativo")

        # Validar fecha de visita
        if entrada.fecha_visita:
            self._validar_fecha_visita(entrada.fecha_visita)

        return True