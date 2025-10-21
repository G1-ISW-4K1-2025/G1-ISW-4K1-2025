from datetime import date
from typing import Optional
from .validacionError import ValidacionError


#Clase que representa una Entrada
class Entrada:
    def __init__(self, fecha_visita: date, edad_visitante: int, tipo_pase: str, precio: float):
        self.id_entrada = None  # ID asignado por la base de datos
        self.fecha_visita = fecha_visita
        self.edad_visitante = edad_visitante
        self.tipo_pase = tipo_pase
        self.precio = precio

    def __str__(self):
        return f"fecha_visita={self.fecha_visita}, edad_visitante={self.edad_visitante}, tipo_pase={self.tipo_pase}, precio={self.precio}"
