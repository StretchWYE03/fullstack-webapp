from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models 
import schemas
from auth import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/", response_model=list[schemas.ItemResponse])
def get_items(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(models.Example).all()

@router.get("/{item_id}", response_model=schemas.ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    item = db.query(models.Example).filter(models.Example.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=schemas.ItemResponse)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_item = models.Example(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=schemas.ItemResponse)
def update_item(item_id: int, item: schemas.ItemUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_item = db.query(models.Example).filter(models.Example.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for field, value in item.model_dump(exclude_unset=True).items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item

