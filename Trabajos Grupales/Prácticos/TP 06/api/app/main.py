from fastapi import FastAPI

app = FastAPI(title="Api para TP06-TDD")


@app.get("/")
def read_root():
    return {"message": "Hola, somos el grupo 1 de la materia ISW!"}
