from fastapi import FastAPI
app = FastAPI()

@app.post("/analise-energetica")
async def analise_energetica():
    return {"message": "Energetic analysis completed successfully."}
