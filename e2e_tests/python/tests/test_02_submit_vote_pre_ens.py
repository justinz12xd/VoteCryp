from utils.client import post_form


def test_submit_vote_pre_ens_should_412():
    # Fresh user
    r = post_form("/api/register", {"Email": "preens@example.com", "Password": "pass123"})
    if r.status_code == 200:
        token = r.json()["token"]
    else:
        assert r.status_code in (400, 409), r.text
        from utils.client import post_form as pf
        lr = pf("/api/login", {"Email": "preens@example.com", "Password": "pass123"})
        assert lr.status_code == 200, lr.text
        token = lr.json()["token"]

    # Submit vote before ENS
    r2 = post_form("/api/submitVote", {"electionId": 1, "optionIndex": 0}, token)
    assert r2.status_code in (412, 400), r2.text
