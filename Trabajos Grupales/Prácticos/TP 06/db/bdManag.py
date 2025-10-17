from datetime import datetime
import sqlite3 

conn =  sqlite3.connect('app.db')
cursor = conn.cursor()

# Crear tabla Usuario
cursor.execute('''
CREATE TABLE IF NOT EXISTS Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mail TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL
)
''')

# Crear tabla Compra
cursor.execute('''
CREATE TABLE IF NOT EXISTS Compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    forma_pago TEXT NOT NULL,
    precio_total REAL NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
)
''')

# Crear tabla Entrada
cursor.execute('''
CREATE TABLE IF NOT EXISTS Entrada (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_visita TEXT NOT NULL,
    edad_visitante INTEGER NOT NULL,
    tipo_pase TEXT NOT NULL,
    precio REAL NOT NULL,
    compra_id INTEGER NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES Compra(id)
)
''')

# Guardar cambios
conn.commit()
print("✓ Tablas creadas exitosamente")
print("\nEstructura de la base de datos:")
print("- Usuario (id, mail, contraseña)")
print("- Compra (id, fecha, forma_pago, precio_total, usuario_id)")
print("- Entrada (id, fecha_visita, edad_visitante, tipo_pase, precio, compra_id)")

# Ejemplo de inserción de datos
def ejemplo_insercion():
    # Insertar un usuario
    cursor.execute('''
    INSERT INTO Usuario (mail, contraseña) 
    VALUES (?, ?)
    ''', ('usuario@example.com', 'password123'))
    usuario_id = cursor.lastrowid
    
    # Insertar una compra
    cursor.execute('''
    INSERT INTO Compra (fecha, forma_pago, precio_total, usuario_id)
    VALUES (?, ?, ?, ?)
    ''', (datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'Tarjeta', 5000.0, usuario_id))
    compra_id = cursor.lastrowid
    
    # Insertar entradas asociadas a la compra
    cursor.execute('''
    INSERT INTO Entrada (fecha_visita, edad_visitante, tipo_pase, precio, compra_id)
    VALUES (?, ?, ?, ?, ?)
    ''', ('2025-11-01', 25, 'General', 2500.0, compra_id))
    
    cursor.execute('''
    INSERT INTO Entrada (fecha_visita, edad_visitante, tipo_pase, precio, compra_id)
    VALUES (?, ?, ?, ?, ?)
    ''', ('2025-11-01', 30, 'General', 2500.0, compra_id))
    
    conn.commit()
    print("\n✓ Datos de ejemplo insertados")

# Descomentar la siguiente línea para ejecutar el ejemplo
# ejemplo_insercion()

# Cerrar conexión
conn.close()
