from datetime import date
from typing import Optional
class ValidacionError(Exception):
    """Excepción personalizada para errores de validación"""
    pass

#Clase que representa una Entrada        
class Entrada:
    def init(self, fecha_visita: date, edad_visitante: Optional[int], tipo_pase: str, precio: float):
        if edad_visitante is None:
            raise ValidacionError("La edad del visitante es requerida")
        if edad_visitante < 0:
            raise ValidacionError("La edad del visitante no puede ser negativa")
        self.fecha_visita = fecha_visita
        self.edad_visitante = edad_visitante
        self.tipo_pase = tipo_pase
        self.precio = precio