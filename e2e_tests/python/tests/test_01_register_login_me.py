from utils.client import post_form, post_json, get


def test_register_login_me_form_flow():
    # Register via form to avoid JSON quirks
    r = post_form("/api/register", {"Email": "e2@example.com", "Password": "pass123"})
    if r.status_code == 200:
        data = r.json()
        assert "token" in data
    else:
        # Allow reruns where the user already exists
        assert r.status_code in (400, 409), r.text

    # Login
    r2 = post_form("/api/login", {"Email": "e2@example.com", "Password": "pass123"})
    assert r2.status_code == 200, r2.text
    token = r2.json()["token"]

    # Me
    r3 = get("/api/me", token)
    assert r3.status_code == 200, r3.text
    me = r3.json()
    # Expect shape: { user: { email, wallet: { address } }, ens: { isVerified: bool, ensName } }
    assert "user" in me and me["user"].get("email") == "e2@example.com"
    assert "wallet" in me["user"] and "address" in me["user"]["wallet"]
    # ENS not registered yet
    assert "ens" in me and me["ens"].get("isVerified") is False
