"""Prueba HTTP de la API (requiere fastapi + httpx). Uso: python -m tests.test_http
Usa SQLite temporal salvo que definas TEST_DATABASE_URL (PostgreSQL)."""
import os
from fastapi.testclient import TestClient
from app.adapters.entrada.api_contrato import create_app
from app.infrastructure.db import Database

url = os.getenv("TEST_DATABASE_URL", "sqlite:///sistep_http_test.db")
if url.startswith("sqlite:///") and os.path.exists(url[10:]): os.remove(url[10:])
c = TestClient(create_app(db=Database(url), origins=["http://localhost:5500"]))
h = {"Origin": "http://localhost:5500"}
assert c.get("/api/dashboard", headers=h).headers["access-control-allow-origin"] == "http://localhost:5500"
o = c.options("/api/alertas", headers={**h, "Access-Control-Request-Method": "GET"}); assert o.status_code == 204 and o.content == b""
assert c.get("/api/alertas/").status_code in (404, 405)               # sin redirecciones
assert c.get("/api/noexiste").json()["error"]["code"] == "NOT_FOUND"  # errores siempre JSON
assert c.get("/api/reportes?rango=15").status_code == 422
assert c.patch("/api/dashboard/alertas/HU-03", content="{malo").status_code == 400
assert c.delete("/api/alertas/AL-020").status_code == 204
r = c.post("/api/eventos", json={"bus_id": "BUS-302", "velocidad_movimiento": 95, "acercamiento_brusco": 1})
assert r.json()["prediccion"] == 1 and c.get("/api/alertas").json()[0]["id"] == r.json()["bandejaId"]
assert c.post("/api/eventos", json={"bus_id": "BUS-302", "velocidad_movimiento": 15, "acercamiento_brusco": 0}).json()["bandejaId"] is None
assert c.get("/").status_code == 200                                    # sirve el frontend en el mismo origen
print("HTTP OK")
if url.startswith("sqlite:///"): os.remove(url[10:])
