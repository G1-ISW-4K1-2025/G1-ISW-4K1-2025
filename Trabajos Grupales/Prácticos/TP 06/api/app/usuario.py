#Clase que representa un Usuario
class Usuario:
    def __init__(self, mail: str, contraseña: str):
        self.mail = mail
        self.contraseña = contraseña