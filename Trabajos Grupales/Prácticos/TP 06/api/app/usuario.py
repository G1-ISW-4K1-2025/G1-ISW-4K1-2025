#Clase que representa un Usuario
class Usuario:
    def __init__(self, nombre: str, apellido: str, mail: str, contraseña: str):
        self.id_usuario = None  # ID asignado por la base de datos
        self.nombre = nombre
        self.apellido = apellido
        self.mail = mail
        self.contraseña = contraseña

    def __str__(self):
        return f"Usuario(id_usuario={self.id_usuario}, nombre={self.nombre}, apellido={self.apellido}, mail={self.mail})"
