from datetime import date
import sqlite3 
import os
from contextlib import contextmanager

# Ruta absoluta al archivo de la base de datos
current_dir = os.path.dirname(os.path.abspath(__file__))
path_db = os.path.join(current_dir, '..', '..', 'db', 'app.db')

from .usuario import Usuario
from .compra import Compra
from .pago import Pago
from .entrada import Entrada


class RepositorioCompraEntradas:
    def __init__(self):
        self.path_db = path_db
        self._verificar_conexion()__

    def _verificar_conexion(self):
        """Método privado para verificar la conexión a la BD"""
        if not os.path.exists(self.path_db):
            print(f"⚠️  ADVERTENCIA: Base de datos no encontrada en: {self.path_db}")
            return
        
        try:
            with sqlite3.connect(self.path_db) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                print(f"✅ Conexión exitosa a BD: {self.path_db}")
        except sqlite3.Error as e:
            print(f"❌ Error de conexión a BD: {e}")
            raise ConnectionError(f"No se puede conectar a la base de datos: {e}")

    @contextmanager
    def _get_connection(self):
        """Context manager para manejo seguro de conexiones"""
        conn = None
        try:
            conn = sqlite3.connect(self.path_db)
            yield conn
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
            raise
        finally:
            if conn:
                conn.close()