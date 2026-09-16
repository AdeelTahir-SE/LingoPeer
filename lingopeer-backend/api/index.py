from fastapi import FastAPI, Request

app = FastAPI(docs_url="/docs", openapi_url="/openapi.json")


@app.get("/")
@app.get("/api")
@app.get("/api/")
def read_root():
    return {"Hello": "World", "status": "running"}


@app.get("/items/{item_id}")
@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def catch_all(request: Request, path_name: str):
    return {
        "message": "FastAPI is running successfully!",
        "requested_path": request.url.path,
        "path_param": path_name
    }