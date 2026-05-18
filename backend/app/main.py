from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_db_tables
from app.api.v1.auth import router as auth_router
from app.api.v1.patients import router as patients_router
from app.api.v1.cases import router as cases_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.signatures import router as signatures_router
from app.api.v1.reports import router as reports_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_tables()
    yield


app = FastAPI(title="Orto-IA API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(patients_router, prefix="/api/v1/patients", tags=["patients"])
app.include_router(cases_router, prefix="/api/v1/cases", tags=["cases"])
app.include_router(analysis_router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(signatures_router, prefix="/api/v1/signatures", tags=["signatures"])
app.include_router(reports_router, prefix="/api/v1/reports", tags=["reports"])


@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0", "environment": "development"}
