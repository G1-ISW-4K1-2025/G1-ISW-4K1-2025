import sqlite3 

# conn =  sqlite3.connect('test_app.db')
conn =  sqlite3.connect('app.db')
cursor = conn.cursor()

# Crear tabla Usuario
cursor.execute('''
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    mail TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL
)
''')

# Crear tabla Compra
cursor.execute('''
CREATE TABLE IF NOT EXISTS Compra (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    precio_total REAL NOT NULL,
    id_usuario INTEGER NOT NULL,
    id_pago INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_pago) REFERENCES Pago(id_pago)
)
''')

# Crear tabla Entrada
cursor.execute('''
CREATE TABLE IF NOT EXISTS Entrada (
    id_entrada INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_visita TEXT NOT NULL,
    edad_visitante INTEGER NOT NULL,
    tipo_pase TEXT NOT NULL,
    precio REAL NOT NULL,
    id_compra INTEGER NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES Compra(id_compra)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Pago (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    forma_pago TEXT NOT NULL,
    estado_pago TEXT NOT NULL,
    codigo_pago INTEGER,
    monto REAL NOT NULL
)
''')

# Guardar cambios
conn.commit()
print("✓ Tablas creadas exitosamente")
print("\nEstructura de la base de datos:")
print("Tabla Usuario: id_usuario, nombre, apellido, mail, contraseña")
print("Tabla Compra: id_compra, fecha, precio_total, id_usuario, id_pago")
print("Tabla Entrada: id_entrada, fecha_visita, edad_visitante, tipo_pase, precio, id_compra")
print("Tabla Pago: id_pago, forma_pago, estado_pago, codigo_pago, monto")

# Cerrar conexión
conn.close()