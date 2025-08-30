import os
import requests
from typing import Dict, Any, Optional

API_BASE = os.environ.get("API_BASE", "http://localhost:8080")


def post_form(path: str, data: Dict[str, Any], token: Optional[str] = None):
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.post(API_BASE + path, data=data, headers=headers, timeout=15)


def post_json(path: str, json: Dict[str, Any], token: Optional[str] = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.post(API_BASE + path, json=json, headers=headers, timeout=15)


def get(path: str, token: Optional[str] = None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.get(API_BASE + path, headers=headers, timeout=15)
