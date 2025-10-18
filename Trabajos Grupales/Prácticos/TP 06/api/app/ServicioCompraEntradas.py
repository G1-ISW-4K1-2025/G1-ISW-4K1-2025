from datetime import date, timedelta
from typing import List, Dict, Optional
from Compra import Compra 
from Entrada import Entrada
from Usuario import Usuario
from Compra import ValidacionError

class ServicioCompraEntradas:
    """
    Servicio que implementa la funcionalidad de compra de entradas
    según la User Story 8 de EcoHarmony Park
    """
    
    def __init__(self):
        self.compras_realizadas: List[Compra] = []
        self.dias_abierto = [0, 1, 2, 3, 4, 5, 6]  # Lunes a Domingo

    def validar_fecha_visita(self, fecha_visita: date) -> bool:
        """
        Valida que la fecha de visita sea válida:
        
        Debe ser hoy o futura
        Debe estar dentro de los días que el parque está abierto
        """
        if fecha_visita < date.today():
            raise ValidacionError("La fecha de visita no puede ser anterior a hoy")

    # Verificar que el parque esté abierto ese día
        if fecha_visita.weekday() not in self.dias_abierto:
            raise ValidacionError("El parque está cerrado en la fecha seleccionada")

        return True

    def validar_cantidad_entradas(self, cantidad: int) -> bool:
            """
            Valida que la cantidad de entradas sea válida:

            Debe ser mayor a 0
            No debe superar las 10 entradas
            """
            if cantidad <= 0:
                raise ValidacionError("Debe solicitar al menos una entrada")

            if cantidad > 10:
                raise ValidacionError("La cantidad de entradas no puede ser mayor a 10")

            return True

            if cantidad <= 0:
                raise ValidacionError("Debe solicitar al menos una entrada")

            if cantidad > 10:
                raise ValidacionError("La cantidad de entradas no puede ser mayor a 10")

            return True

    def calcular_precio_entrada(self, edad: int, tipo_pase: str) -> float:
        """
        Calcula el precio de una entrada según edad y tipo de pase
        """
        if tipo_pase == "VIP":
            return 200.0

    #Pase Regular
        if edad < 12:
            return 50.0  # Niños
        elif edad >= 65:
            return 75.0  # Adultos mayores
        else:
            return 100.0  # General

    def crear_entradas(self, fecha_visita: date, edades: List[int], tipo_pase: str = "Regular") -> List[Entrada]:
        """
        Crea las entradas según los datos proporcionados
        """
        entradas = []

        for edad in edades:
            if edad is None:
                raise ValidacionError("Todas las entradas deben tener edad del visitante")

            precio = self.calcular_precio_entrada(edad, tipo_pase)
            entrada = Entrada(
                fecha_visita=fecha_visita,
                edad_visitante=edad,
                tipo_pase=tipo_pase,
                precio=precio
            )
            entradas.append(entrada)

        return entradas
    

#Ejemplo de uso
if __name__ == "__main__":
    servicio = ServicioCompraEntradas()
#Crear un usuario registrado
    usuario = Usuario(mail="ana@example.com", contraseña="1234")