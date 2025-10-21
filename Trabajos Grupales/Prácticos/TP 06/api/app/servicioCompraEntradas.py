from datetime import date
import random
from typing import List, Dict, Tuple
from .compra import Compra 
from .entrada import Entrada
from .validacionError import ValidacionError
from .pagoError import PagoError
from .usuario import Usuario
from .pago import Pago
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


    def validar_compra(self, forma_pago: str, entradas: List[Entrada], usuario_id: int) -> Tuple[Compra, int, date, str]:
        """
        Valida y procesa una compra completa.
        Retorna: (compra, cantidad_entradas, fecha_compra, estado_envio_mail)
        """
        try:
            # Validaciones de entrada
            forma_pago_validada = self._validar_forma_pago(forma_pago)
            usuario = self._validar_usuario_registrado(usuario_id)
            self._validar_cantidad_entradas(len(entradas))
            
            # Validar cada entrada individualmente
            entradas_validadas = []
            for entrada in entradas:
                if not self._validar_entrada_completa(entrada):
                    raise ValidacionError("Entrada inválida")
                entradas_validadas.append(entrada)
            
            # Crear la compra
            compra = self._crear_compra_con_pago(entradas_validadas, usuario, forma_pago_validada)
            
            # Envío de confirmación según forma de pago
            estado_envio_mail = self._procesar_confirmacion_inicial(compra, forma_pago_validada)
            
            return compra, len(compra.entradas), compra.fecha, estado_envio_mail
            
        except (ValidacionError, PagoError) as e:
            raise e
        except Exception as e:
            raise ValidacionError(f"Error inesperado durante la validación: {str(e)}")
        
    def generar_resumen_compra(self, compra: Compra) -> Dict:
        """
        Genera un resumen detallado de la compra.
        """
        resumen = {
            "id_compra": compra.id_compra,
            "fecha_compra": compra.fecha.isoformat(),
            "precio_total": compra.precio_total,
            "usuario": {
                "id": compra.usuario.id_usuario,
                "nombre": f"{compra.usuario.nombre} {compra.usuario.apellido}",
                "email": compra.usuario.mail
            },
            "pago": {
                "forma_pago": compra.pago.forma_pago,
                "estado": compra.pago.estado_pago,
                "codigo": compra.pago.codigo_pago,
                "monto": compra.pago.monto
            },
            "entradas": []
        }
        
        for entrada in compra.entradas:
            resumen["entradas"].append({
                "id_entrada": entrada.id_entrada,
                "fecha_visita": entrada.fecha_visita,
                "tipo_pase": entrada.tipo_pase,
                "edad_visitante": entrada.edad_visitante,
                "precio": entrada.precio
            })
        
        return resumen

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
    

    def _crear_compra_con_pago(self, entradas: List[Entrada], usuario: Usuario, forma_pago: str) -> Compra:
        """Crea la compra con el pago correspondiente."""
        compra = Compra(entradas, usuario)
        
        if forma_pago == "efectivo":
            compra.pago = Pago(forma_pago, "PAGO_A_REALIZAR_EN_CAJA", 0, compra.precio_total) 
        elif forma_pago == "tarjeta":
            compra.pago = Pago(forma_pago, "PAGO_PENDIENTE_POR_MERCADO_PAGO", 0, compra.precio_total)
        
        try:
            return self.repositorio.crear_compra(compra)
        except Exception as e:
            raise ValidacionError(f"Error al crear la compra: {str(e)}")
        
    def _procesar_confirmacion_inicial(self, compra: Compra, forma_pago: str) -> str:
        """Procesa la confirmación inicial según la forma de pago."""
        if forma_pago == "efectivo":
            return self._enviar_mail_confirmacion_efectivo(compra)
        return "PENDIENTE"

    def _enviar_mail_confirmacion_efectivo(self, compra: Compra) -> str:
        """Envía confirmación para pago en efectivo."""
        print(f"Enviando mail de confirmación de pago en efectivo para la compra {compra.id_compra}")
        return "ENVIADO"