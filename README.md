# KADR storefront

The customer-facing site: `index.html` + `script.js` + `style.css`, no build step.

Everything a customer sees comes from the **KADR back office**
([kadr-backoffice](https://github.com/Unnknownn006/kadr-backoffice)):
paintings and their photos, names and descriptions in EN/HY/RU, categories, tags,
sizes / materials / frames / glass with prices, homepage collections, delivery zones,
contacts and the legal pages. Edit them in the back office; the site shows the change
on the next page load (at most ~20 s with the CDN cache).

Orders placed on the site land in the back office as "awaiting payment"; the customer
gets an order code, bank details and a status page that follows the back office.

## How it talks to the back office

| Site path        | Goes to                                  | What                                  |
|------------------|------------------------------------------|---------------------------------------|
| `/api/public/*`  | back office `/api/public/*`              | catalogue (`bootstrap`), orders, pages |
| `/media/*`       | back office `/media/*`                   | product photos                        |
| `/o/*`           | back office `/o/*`                       | printable order status page           |

In production `vercel.json` rewrites these paths, so the site and its API share one
origin (no CORS). To point the site at another back office, change the three
destinations in `vercel.json`. (Calling the API cross-origin instead — via
`<meta name="kadr-api" content="https://…">` in `index.html` — also works, but then the
back office must list the site in its `CORS_ORIGINS` variable.)

What stays in the customer's browser: cart, favourites, recently viewed, saved
addresses, taste profile and the list of their own order codes.

## Run locally

Start the back office first (see its README), then:

```bash
python3 dev_server.py --api http://localhost:8000 --port 5173
```

Open http://localhost:5173. `dev_server.py` serves the files and forwards the three
paths above to the back office, like Vercel does in production. To use the live
back office instead: `--api https://kadr-backoffice.vercel.app`.

## Deploy

Vercel, framework preset "Other", no build command, output directory `.`.
