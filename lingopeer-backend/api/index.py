import sys
from pathlib import Path

# Ensure lingopeer-backend root and api dir are in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.auth.router import auth_router
from api.chat.router import chat_router

class VercelPathMiddleware:
    """
    On Vercel serverless Python, rewrites to /api/index.py pass the target file
    as the ASGI path. This middleware recovers the true requested path from
    headers like 'x-invoke-path', 'x-matched-path', or 'x-forwarded-uri'.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            matched_path = (
                headers.get(b"x-invoke-path")
                or headers.get(b"x-matched-path")
                or headers.get(b"x-forwarded-uri")
                or headers.get(b"x-real-path")
            )
            if matched_path:
                path_str = matched_path.decode("utf-8").split("?")[0]
                if path_str and not path_str.endswith(".py"):
                    if not path_str.startswith("/"):
                        path_str = "/" + path_str
                    scope["path"] = path_str
                    scope["raw_path"] = path_str.encode("utf-8")

            invoke_query = headers.get(b"x-invoke-query")
            if invoke_query and not scope.get("query_string"):
                scope["query_string"] = invoke_query

        await self.app(scope, receive, send)


app = FastAPI(
    title="LingoPeer Backend API",
    description="FastAPI Backend with Supabase Authentication and AI Language Peer features",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# Recover true path when running behind Vercel serverless rewrites
app.add_middleware(VercelPathMiddleware)

# Enable CORS for local dev (Expo / React Native / Web) and deployed frontends
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Authentication and Chat/Agents routers
# Mounted at both root and /api prefix to support direct calls and Vercel rewrites
app.include_router(auth_router, prefix="/auth")
app.include_router(auth_router, prefix="/api/auth")

app.include_router(chat_router, prefix="")
app.include_router(chat_router, prefix="/api")


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