from fastapi import FastAPI
from core.config import settings
from api.router import router as api_router

app = FastAPI(title=settings.APP_NAME)
app.include_router(api_router)

@app.get("/")
def root():
    return {"success": True, "message": f"{settings.APP_NAME} API running", "data": {}}
    
