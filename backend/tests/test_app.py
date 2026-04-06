import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


# ── Test GET /tasks ────────────────────────────────
def test_get_tasks_returns_200(client):
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)


# ── Test POST /tasks ───────────────────────────────
def test_create_task_success(client):
    response = client.post("/tasks",
        data=json.dumps({"title": "Learn Docker"}),
        content_type="application/json"
    )
    assert response.status_code == 201
    assert response.get_json()["title"] == "Learn Docker"

def test_create_task_missing_title(client):
    response = client.post("/tasks",
        data=json.dumps({}),
        content_type="application/json"
    )
    assert response.status_code == 400
    assert "error" in response.get_json()


# ── Test DELETE /tasks/:id ─────────────────────────
def test_delete_task_not_found(client):
    response = client.delete("/tasks/9999")
    assert response.status_code == 404
    assert "error" in response.get_json()

def test_delete_task_success(client):
    # First create a task
    create = client.post("/tasks",
        data=json.dumps({"title": "Delete Me"}),
        content_type="application/json"
    )
    task_id = create.get_json()["id"]
    # Then delete it
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200
