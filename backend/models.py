from sqlalchemy import Column, Integer, String, Boolean, Double
from database import Base

class Example(Base):
    __tablename__ = "example_table"

    id = Column(Integer, primary_key = True, index = True)
    text = Column(String, nullable = False)
    number = Column(Double, nullable = False)
    binary = Column(Boolean, nullable = False)
    
class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(Integer, primary_key=True, index=True)

    # User ID from Supabase Auth
    user_id = Column(String, nullable=False, unique=True, index=True)
    # Role must be "original_admin", "admin", or "user"
    role = Column(String, nullable=False, default="user")
    # Tracks who granted the role
    created_by = Column(String, nullable=True)
