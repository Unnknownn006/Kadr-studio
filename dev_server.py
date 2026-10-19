"""Local development server for the KADR storefront.

Serves index.html / script.js / style.css and forwards /api/public/*, /media/* and /o/*
to the back office — exactly what vercel.json does in production, so the site talks to
its API on the same origin.

    python3 dev_server.py                       # back office at http://localhost:8000
    python3 dev_server.py --api https://kadr-backoffice.vercel.app --port 5173
"""

import argparse
import http.server
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
PROXIED = ("/api/public/", "/media/", "/o/")


class Handler(http.server.SimpleHTTPRequestHandler):
    api = "http://localhost:8000"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _proxy(self) -> None:
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        req = urllib.request.Request(self.api + self.path, data=body, method=self.command)
        for h in ("Content-Type", "Accept", "Accept-Language", "If-None-Match"):
            if self.headers.get(h):
                req.add_header(h, self.headers[h])
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                status, headers, data = r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            status, headers, data = e.code, e.headers, e.read()
        except urllib.error.URLError as e:
            self.send_error(502, f"back office unreachable: {e.reason}")
            return
        self.send_response(status)
        for h in ("Content-Type", "Cache-Control", "ETag"):
            if headers.get(h):
                self.send_header(h, headers[h])
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith(PROXIED):
            self._proxy()
        else:
            super().do_GET()

    def end_headers(self) -> None:
        # local files: always revalidate, so an edited script.js / style.css shows on reload
        if not self.path.startswith(PROXIED):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.startswith(PROXIED):
            self._proxy()
        else:
            self.send_error(405)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", default="http://localhost:8000")
    ap.add_argument("--port", type=int, default=5173)
    args = ap.parse_args()
    Handler.api = args.api.rstrip("/")
    print(f"KADR storefront on http://localhost:{args.port} → back office {Handler.api}")
    http.server.ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()
