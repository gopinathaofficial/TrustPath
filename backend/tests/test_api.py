from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_item_crud():
    created = client.post("/api/v1/items", json={"name": "First", "description": "test"})
    assert created.status_code == 201
    item_id = created.json()["id"]

    assert client.get(f"/api/v1/items/{item_id}").json()["name"] == "First"
    assert any(i["id"] == item_id for i in client.get("/api/v1/items").json())

    assert client.delete(f"/api/v1/items/{item_id}").status_code == 204
    assert client.get(f"/api/v1/items/{item_id}").status_code == 404
