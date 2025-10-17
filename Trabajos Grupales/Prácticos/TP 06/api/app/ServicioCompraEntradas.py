from datetime import date, timedelta
from typing import List, Dict, Optional
from Compra import Compra 
from Entrada import Entrada
from Usuario import Usuario


class ServicioCompraEntradas:
    """
    Servicio que implementa la funcionalidad de compra de entradas
    según la User Story 8 de EcoHarmony Park
    """
    
    def __init__(self):
        self.compras_realizadas: List[Compra] = []
        self.dias_abierto = [0, 1, 2, 3, 4, 5, 6]  # Lunes a Domingo