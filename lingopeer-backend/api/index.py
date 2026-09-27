import sys
from pathlib import Path

# Ensure lingopeer-backend root is in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.auth.router import auth_router

app = FastAPI(
    title="LingoPeer Backend API",
    description="FastAPI Backend with Supabase Authentication and AI Language Peer features",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# Enable CORS for local dev (Expo / React Native / Web) and deployed frontends
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Authentication router
# Mounted at both /auth and /api/auth to support direct calls and Vercel rewrites
app.include_router(auth_router, prefix="/auth")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/")
@app.get("/api")
@app.get("/api/")
def read_root():
    return {
        "name": "LingoPeer Backend API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/items/{item_id}")
@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def catch_all(request: Request, path_name: str):
    return {
        "message": "FastAPI route not found",
        "requested_path": request.url.path,
        "path_param": path_name,
    }