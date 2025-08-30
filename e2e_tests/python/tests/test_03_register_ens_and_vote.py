import os
import requests
from utils.client import post_form, get

BC_BASE = os.environ.get("BC_BASE", "http://localhost:4002")


def ensure_election():
    # Quick helper route exists; tolerate if already created
    q = {
        "title": "Quick One",
        "options": "Alice,Bob",
        "durationHours": "2",
        "enableFHE": "false",
    }
    try:
        requests.get(f"{BC_BASE}/createElectionQuick", params=q, timeout=10)
    except Exception:
        pass


def test_register_ens_and_vote_end_to_end():
    ensure_election()

    # Register user
    r = post_form("/api/register", {"Email": "ensvote@example.com", "Password": "pass123"})
    if r.status_code == 200:
        token = r.json()["token"]
    else:
        assert r.status_code in (400, 409), r.text
        from utils.client import post_form as pf
        lr = pf("/api/login", {"Email": "ensvote@example.com", "Password": "pass123"})
        assert lr.status_code == 200, lr.text
        token = lr.json()["token"]

    # Register ENS name
    r2 = post_form("/api/register-ens", {"ensName": "alice.eth"}, token)
    if r2.status_code != 200:
        # Provide diagnostics to help debug
        detail = r2.text
        # Try a second attempt in case of temporary funding/nonce issues
        r2b = post_form("/api/register-ens", {"ensName": "alice.eth"}, token)
        assert r2b.status_code == 200, f"register-ens failed. First: {detail} Second: {r2b.status_code} {r2b.text}"

    # Vote
    r3 = post_form("/api/submitVote", {"electionId": 1, "optionIndex": 1}, token)
    assert r3.status_code == 200, r3.text

    # Results should be available
    r4 = get("/api/results")
    assert r4.status_code == 200, r4.text
    # Structure varies depending on mock services; ensure JSON
    _ = r4.json()
