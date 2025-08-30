import os
import time
import pytest
import requests

API_BASE = os.environ.get("API_BASE", "http://localhost:8080")
BC_BASE = os.environ.get("BC_BASE", "http://localhost:4002")


def wait_for(url: str, timeout: int = 90):
    """Wait until url returns 200 OK."""
    start = time.time()
    last_err = None
    while time.time() - start < timeout:
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                return r
        except Exception as e:
            last_err = e
        time.sleep(1)
    raise RuntimeError(f"Service at {url} not ready: {last_err}")


@pytest.fixture(scope="session", autouse=True)
def services_up():
    # Ensure go-api and blockchain-service are reachable
    wait_for(f"{API_BASE}/health")
    wait_for(f"{BC_BASE}/health")


@pytest.fixture(scope="session")
def api_base():
    return API_BASE


@pytest.fixture(scope="session")
def bc_base():
    return BC_BASE
