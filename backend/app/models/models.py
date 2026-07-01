import uuid
from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.core.database import Base


class CaseStatus(str, Enum):
    PENDING = "pending"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    cro: Mapped[str] = mapped_column(String(50), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    subscription_tier: Mapped[str] = mapped_column(String(50), default="starter")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    franchise_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Signature(Base):
    __tablename__ = "signatures"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), unique=True)
    embedding: Mapped[Optional[list]] = mapped_column(Vector(1536), nullable=True)
    signature_metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    cases_count: Mapped[int] = mapped_column(Integer, default=0)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    orthodontist_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    franchise_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    birth_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    sex: Mapped[Optional[str]] = mapped_column(String(1), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    chief_complaint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    medical_history: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Case(Base):
    __tablename__ = "cases"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id: Mapped[str] = mapped_column(String, ForeignKey("patients.id"))
    orthodontist_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    franchise_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[CaseStatus] = mapped_column(SAEnum(CaseStatus), default=CaseStatus.PENDING)
    processing_stage: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    patient_age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    patient_sex: Mapped[Optional[str]] = mapped_column(String(1), nullable=True)
    chief_complaint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    anamnesis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_urls: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    ai_diagnosis: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    treatment_plan: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    clinical_warnings: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    pdf_report_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    analyzed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class CephalometricMeasurement(Base):
    __tablename__ = "cephalometric_measurements"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String, ForeignKey("cases.id"))
    source: Mapped[str] = mapped_column(String(50), default="webceph")
    sna: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    snb: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    anb: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fma: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    impa: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fmia: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    u1_na_angle: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    u1_na_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    l1_nb_angle: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    l1_nb_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    wits: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    co_a: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    co_gn: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    facial_axis: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    convexity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    overjet: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    overbite: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    author: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[Optional[list]] = mapped_column(Vector(1536), nullable=True)
    measurement: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    norm_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    norm_sd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    norm_unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    year_published: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
