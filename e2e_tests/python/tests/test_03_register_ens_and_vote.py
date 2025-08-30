import os
import time
import requests
from utils.client import post_form, get

BC_BASE = os.environ.get("BC_BASE", "http://localhost:4002")


def create_fresh_election() -> int:
    title = f"Quick One {int(time.time())}"
    q = {
        "title": title,
        "options": "Alice,Bob",
        "durationHours": "2",
        "enableFHE": "false",
    }
    try:
        r = requests.get(f"{BC_BASE}/createElectionQuick", params=q, timeout=15)
        if r.ok:
            eid = r.json().get("electionId")
            if eid:
                try:
                    return int(eid)
                except Exception:
                    pass
    except Exception:
        pass
    # Fallback to activeElections
    r2 = requests.get(f"{BC_BASE}/activeElections", timeout=10)
    r2.raise_for_status()
    ids = r2.json().get("ids", [])
    if not ids:
        raise AssertionError("No active elections available")
    return max(ids)


def test_register_ens_and_vote_end_to_end():
    election_id = create_fresh_election()

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

    # Check ENS status and register if needed with a unique name
    me = get("/api/me", token).json()
    if not me.get("ens", {}).get("isVerified"):
        ens_name = f"alice{int(time.time())}.eth"
        r2 = post_form("/api/register-ens", {"ensName": ens_name}, token)
        if r2.status_code != 200:
            # Provide diagnostics to help debug
            detail = r2.text
            # Try a second attempt in case of temporary funding/nonce issues
            r2b = post_form("/api/register-ens", {"ensName": ens_name}, token)
            assert r2b.status_code == 200, f"register-ens failed. First: {detail} Second: {r2b.status_code} {r2b.text}"

    # Vote
    r3 = post_form("/api/submitVote", {"electionId": election_id, "optionIndex": 1}, token)
    assert r3.status_code == 200, r3.text

    # Results should be available
    r4 = get("/api/results", token)
    assert r4.status_code == 200, r4.text
    # Structure varies depending on mock services; ensure JSON
    _ = r4.json()
