from fastapi import FastAPI, Body, Query
from pydantic import BaseModel
from local import comida
from typing import Optional, List
from stats import factorial, stats

app = FastAPI();


app.title = "Test"
app.version = "1.0.0"

class Food(BaseModel):
    id: int
    nombre: str
    precio: float
    
class FoodUpdate(BaseModel):
    nombre: Optional[str] = None
    precio: Optional[float] = None

class ListaNumeros(BaseModel):
    datos: List[float]  

@app.get("/home", tags=["home"])
async def read_root():
    return {"saludo": "hola mundo",
            "comida": comida
            }
    

@app.get("/foods/", tags=["food"])
async def get_foods():
    return comida

    

@app.get("/food/{nombre}/precio/{precio}", tags=["food"])
async def get_food_by_id(nombre: str, precio: float):
    for food in comida:
        if food["nombre"] == nombre and food["precio"]==precio:
            return food
    return {"error": "Food not found"}


@app.post("/create/food/", tags=["food"])
async def create_food(item : Food = Body()):
    comida.append({"id": item.id,
                   "nombre": item.nombre, 
                   "precio": item.precio
                   })
    return {"message":"comida agregada"}
    
    
@app.delete("/delete/food/{id}",tags=["food"])
async def delete_food(id:int):
    for food in comida:
        if food["id"] == id:
            comida.remove(food)
            return {"message": "comida eliminada"}
    return {"error": "Food not found"}

@app.patch("/update/food/{id}", tags=["food"])
async def update_food(id:int, food_update: FoodUpdate):
    for food in comida:
        if food["id"] == id:
            if food_update.nombre is not None:
                food["nombre"] = food_update.nombre
            if food_update.precio is not None:
                food["precio"] = food_update.precio
            return {"message": "comida actualizada"}
        return {"error": "Food not found"}
    
@app.get("/factorial/{n}", tags=["math"])
async def compute_factorial(n: int):
    result = factorial(n)
    return {"number": n, "factorial": result}

@app.post("/stats/object/", tags=["math"])
async def compute_stats_obj(contenedor: ListaNumeros):

    lista_limpia = contenedor.datos 
    return {
        "mensaje": "Recibido correctamente",
        "cantidad_numeros": len(lista_limpia),
        "primer_numero": lista_limpia[0]*5
    }