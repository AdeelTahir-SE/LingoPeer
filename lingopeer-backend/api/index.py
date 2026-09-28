import sys
from pathlib import Path

# Ensure lingopeer-backend root and api dir are in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from urllib.parse import parse_qs, urlencode
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from api.auth.router import auth_router
from api.chat.router import chat_router

class VercelPathMiddleware:
    """
    On Vercel serverless Python, rewrites to /api/index.py pass the target file
    as the ASGI path. This middleware recovers the true requested path from
    the '__path__' query parameter, or headers like 'x-invoke-path', 'x-forwarded-uri', etc.
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            query_bytes = scope.get("query_string", b"")
            query_str = query_bytes.decode("utf-8") if query_bytes else ""

            # 1. Recover path from __path__ query param (injected by vercel.json rewrite)
            if "__path__=" in query_str:
                parsed = parse_qs(query_str, keep_blank_values=True)
                if "__path__" in parsed:
                    original_path = parsed.pop("__path__")[0]
                    if not original_path.startswith("/"):
                        original_path = "/" + original_path
                    scope["path"] = original_path
                    scope["raw_path"] = original_path.encode("utf-8")
                    clean_query = urlencode(parsed, doseq=True)
                    scope["query_string"] = clean_query.encode("utf-8")

            # 2. Check candidate headers if path is still /api/index.py or ends with .py
            current_path = scope.get("path", "")
            if not current_path or current_path.endswith(".py") or current_path == "/api/index.py":
                headers = dict(scope.get("headers", []))
                candidate_paths = [
                    headers.get(b"x-invoke-path"),
                    headers.get(b"x-forwarded-uri"),
                    headers.get(b"x-original-url"),
                    headers.get(b"x-real-path"),
                    headers.get(b"x-matched-path"),
                ]
                for candidate in candidate_paths:
                    if not candidate:
                        continue
                    path_str = candidate.decode("utf-8").split("?")[0]
                    if path_str and not path_str.endswith(".py"):
                        if not path_str.startswith("/"):
                            path_str = "/" + path_str
                        scope["path"] = path_str
                        scope["raw_path"] = path_str.encode("utf-8")
                        break

            # 3. Check x-invoke-query if query_string was empty
            headers = dict(scope.get("headers", []))
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
def read_root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept:
        html_content = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>LingoPeer API</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #F4F7FB; color: #1E293B; }
    .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 90%; width: 420px; }
    h2 { margin-top: 0; color: #4F46E5; }
    p { color: #64748B; font-size: 0.95rem; }
    .btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #4F46E5; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>LingoPeer Backend API</h2>
    <p id="msg">API is running. <a href="/docs">View Docs</a></p>
    <a id="btn" class="btn" style="display:none;" href="#">Open LingoPeer App</a>
  </div>
  <script>
    if (window.location.hash && window.location.hash.includes("access_token")) {
      const targetUrl = "lingopeer://auth/callback" + window.location.hash;
      document.getElementById("msg").innerText = "Authentication successful! Redirecting to app...";
      const btn = document.getElementById("btn");
      btn.href = targetUrl;
      btn.style.display = "inline-block";
      window.location.href = targetUrl;
    }
  </script>
</body>
</html>"""
        return HTMLResponse(content=html_content, status_code=200)

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
    return JSONResponse(
        status_code=404,
        content={
            "message": "FastAPI route not found",
            "requested_path": request.url.path,
            "path_param": path_name,
        },
    )