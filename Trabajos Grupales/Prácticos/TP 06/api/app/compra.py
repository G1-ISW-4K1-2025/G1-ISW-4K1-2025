from datetime import date
from typing import List, Optional

from .pago import Pago
from .entrada import Entrada
from .validacionError import ValidacionError
from .usuario import Usuario

#Clase que representa una Compra
class Compra:
    def __init__(self, entradas: List[Entrada], usuario: Usuario, pago: Optional[Pago] = None):
        self.id_compra = None  # ID asignado por la base de datos
        self.fecha = date.today()
        self.entradas = entradas
        self.precio_total = self.calcular_precio_total()
        self.usuario = usuario
        self.pago = pago

    def calcular_precio_total(self) -> float:
        subtotal = sum(entrada.precio for entrada in self.entradas)
        porcentaje_impuestos = 0.15
        impuestos = subtotal * porcentaje_impuestos
        comision_de_plataforma = 1250.50
        return subtotal + impuestos + comision_de_plataforma
    

    def __str__(self):
        return f"fecha={self.fecha},\n forma_pago={self.forma_pago},\n precio_total={self.precio_total},\n usuario={self.usuario.nombre} {self.usuario.apellido},\n entradas= [{' | '.join(str(entrada) for entrada in self.entradas)}]"



# #Clase que representa una Compra
# class Compra:
#     def __init__(self, fecha: date, forma_pago: str, entradas: List[Entrada], precio_total: float, usuario: Optional[Usuario]):
#         # Validar usuario
#         if usuario is None:
#             raise ValidacionError("El usuario es requerido")

#         #Validar fecha
#         if fecha < date.today():
#             raise ValidacionError("La fecha no puede ser anterior a hoy")

#         #Validar que todas las entradas tengan edad
#         for entrada in entradas:
#             if entrada.edad_visitante is None:
#                 raise ValidacionError("Todas las entradas deben tener edad del visitante")

#         #Validar cantidad de entradas vs precio
#         total_esperado = sum(e.precio for e in entradas)
#         if len(entradas) != precio_total / 100:  # Asumiendo que cada entrada regular cuesta 100
#             if precio_total != total_esperado:
#                 raise ValidacionError("El número de entradas no coincide con el precio total")

#         self.fecha = fecha
#         self.forma_pago = forma_pago
#         self.entradas = entradas
#         self.precio_total = precio_total
#         self.usuario = usuario

#     def redirigir_a_pago(self, forma_pago: str) -> str:
#         """Método que simula la redirección a Mercado Pago"""
#         if forma_pago == "tarjeta":
#             return "https://mercadopago.com/pago123"
#         return ""

#     def enviar_mail_confirmacion(self, usuario: Usuario, compra: 'Compra') -> None:
#         """Método que simula el envío de mail de confirmación"""
#         pass

