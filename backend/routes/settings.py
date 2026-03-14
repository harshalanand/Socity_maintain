from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import json

router = APIRouter()

# Settings stored as JSON in memory (in production, use database)
_settings = {
    "organization_name": "Aashiyana Homes",
    "organization_address": "",
    "notification_email": "",
    "timezone": "IST"
}

class SettingsUpdate(BaseModel):
    organization_name: str = None
    organization_address: str = None
    notification_email: str = None
    timezone: str = None

@router.get("")
async def get_settings():
    """Get system settings"""
    return _settings

@router.put("")
async def update_settings(settings_data: SettingsUpdate):
    """Update system settings"""
    global _settings
    
    if settings_data.organization_name:
        _settings["organization_name"] = settings_data.organization_name
    if settings_data.organization_address is not None:
        _settings["organization_address"] = settings_data.organization_address
    if settings_data.notification_email is not None:
        _settings["notification_email"] = settings_data.notification_email
    if settings_data.timezone:
        _settings["timezone"] = settings_data.timezone
    
    return {"message": "Settings updated successfully", "settings": _settings}
