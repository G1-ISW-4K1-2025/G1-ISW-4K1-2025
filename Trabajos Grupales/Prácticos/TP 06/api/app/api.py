from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .servicioCompraEntradas import ServicioCompraEntradas
from .entrada import Entrada
from .validacionError import ValidacionError

app = FastAPI(title="Api para TP06-TDD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.service = ServicioCompraEntradas()

@app.get("/")
def read_root():
    return {"message": "Hola, somos el grupo 1 de la materia ISW!"}

@app.post("/validar-compra-entradas")
def validar_compra_entradas(compra: dict):
    # Función helper para respuesta de error
    def error_response(message):
        return {"status_code": 400, "message": f"Error: {message}", "detalle_compra": None, "cantidad_entradas": 0, "fecha_compra": None, "envio_de_mail": "NO_ENVIADO"}
    
    # Validaciones básicas
    if not compra.get("forma_pago"):
        return error_response("Debe especificar la forma de pago")
    if not compra.get("entradas"):
        return error_response("Debe especificar las entradas a comprar")
    if not compra.get("id_usuario"):
        return error_response("Debe especificar el ID del usuario")
    if not compra.get("fecha_visita"):
        return error_response("Debe especificar la fecha de visita")
    forma_pago = compra.get("forma_pago")
    id_usuario = compra.get("id_usuario")
    fecha_visita = compra.get("fecha_visita")  # Obtenemos la fecha una sola vez
    # Crear objetos Entrada
    entradas = []
    for entrada_data in compra.get("entradas"):
        entrada = Entrada(
            fecha_visita=fecha_visita,
            edad_visitante=entrada_data.get("edad_visitante"),
            tipo_pase=entrada_data.get("tipo_pase"),
            precio=entrada_data.get("precio")
        )
        entradas.append(entrada)

    try:
        compra_result, cantidad_entradas, fecha_compra, estado_envio_de_mail = app.service.validar_compra(
            forma_pago, 
            entradas, 
            id_usuario
        )
        
        # Usar el método generar_resumen_compra del servicio
        detalle_compra = app.service.generar_resumen_compra(compra_result)
        
        return {
            "status_code": 200, 
            "message": "Compra validada con éxito", 
            "detalle_compra": detalle_compra, 
            "cantidad_entradas": cantidad_entradas, 
            "fecha_compra": fecha_compra.isoformat() if fecha_compra else None, 
            "envio_de_mail": estado_envio_de_mail
        }
    except ValidacionError as ve:
        return error_response(str(ve))
    except Exception as e:
        return {"status_code": 500, "message": "Error interno del servidor", "detalle_compra": None, "cantidad_entradas": 0, "fecha_compra": None, "envio_de_mail": "NO_ENVIADO"}
