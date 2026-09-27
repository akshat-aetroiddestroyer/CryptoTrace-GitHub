# Deploy CryptoTrace (permanent free link)

Your prototype is a **static website** (`index.html` at the repo root).  
No Node build is required for the demo. Free hosting on **Vercel** or **Netlify** works in a few minutes.

---

## What you need

| Item | Required? |
|------|-----------|
| GitHub account | Yes (easiest path) |
| This project on GitHub | Yes — push `CryptoTrace-GitHub` first |
| Vercel and/or Netlify account | Yes — sign up with GitHub (free) |
| Credit card | **No** for free hobby plans |
| Domain | Optional (free `*.vercel.app` / `*.netlify.app` is enough) |

Files already in the repo for deploy:

- `index.html` — full demo  
- `vercel.json` — Vercel config  
- `netlify.toml` — Netlify config  
- `extension/` — not part of the website; judges load it in Chrome separately  

---

## Path A — Vercel (recommended)

### 1. Push code to GitHub
If not done yet, follow `GITHUB_PUSH.md`, then confirm:

`https://github.com/YOUR_USERNAME/CryptoTrace`

### 2. Sign up on Vercel
1. Open https://vercel.com/signup  
2. Choose **Continue with GitHub**  
3. Authorize Vercel  

### 3. Import the project
1. Dashboard → **Add New…** → **Project**  
2. **Import** your `CryptoTrace` repository  
3. Settings (leave defaults for static site):

   | Field | Value |
   |-------|--------|
   | Framework Preset | **Other** (or leave blank) |
   | Root Directory | `.` (root) |
   | Build Command | *leave empty* |
   | Output Directory | `.` or leave empty |
   | Install Command | *leave empty* |

4. Click **Deploy**  

### 4. Get your live link
After ~30–60 seconds:

`https://cryptotrace-xxxx.vercel.app`  

(or `https://YOUR_PROJECT_NAME.vercel.app`)

Every `git push` to `main` auto-redeploys.

### 5. Optional: custom name
Project → **Settings** → **Domains** → edit the `*.vercel.app` subdomain.

---

## Path B — Netlify

### 1. Push code to GitHub
Same as above.

### 2. Sign up on Netlify
1. Open https://app.netlify.com/signup  
2. **Sign up with GitHub**  

### 3. Import the project
1. **Add new site** → **Import an existing project**  
2. Choose **GitHub** → select `CryptoTrace`  
3. Build settings:

   | Field | Value |
   |-------|--------|
   | Branch | `main` |
   | Build command | leave empty **or** `echo static` |
   | Publish directory | `.` (repo root, where `index.html` is) |

4. Click **Deploy site**  

### 4. Get your live link
`https://random-name-123.netlify.app`

Site settings → **Domain management** → change site name to e.g. `cryptotrace-sih`  
→ `https://cryptotrace-sih.netlify.app`

### 5. Drag-and-drop (no GitHub)
If you prefer not to use Git:

1. Zip only what you need, or open the folder with `index.html`  
2. https://app.netlify.com/drop  
3. Drag the **folder** that contains `index.html`  
4. Netlify gives an instant URL  

---

## Quick check after deploy

Open the live URL and verify:

- [ ] Home / Problem section loads  
- [ ] **Trace & live graph** → Run trace  
- [ ] **Voice complaint** → Generate formal complaint  
- [ ] **Browser extension** → hard warning modal  
- [ ] Chat button (bottom-right) opens  

---

## Common problems

| Issue | Fix |
|--------|-----|
| 404 on refresh of a path | `vercel.json` / `netlify.toml` already rewrite to `index.html` |
| Blank page | Confirm `index.html` is at **repo root**, not inside a subfolder |
| Old content after push | Wait for deploy to finish; hard-refresh (`Ctrl+Shift+R`) |
| Build failed | Clear **Build command** and **Install command**; this site needs no build |
| Extension not “installed” from the website | Expected — extension is loaded via Chrome **Load unpacked** from `extension/` folder |

---

## Which should you pick?

| | Vercel | Netlify |
|--|--------|---------|
| Free HTTPS link | Yes | Yes |
| Auto-deploy from GitHub | Yes | Yes |
| Ease for static HTML | Excellent | Excellent |
| Drag-and-drop without Git | Limited | **Yes** (Netlify Drop) |

For SIH judges, either link is fine. Put the URL in your README and pitch deck.

---

## After deploy — update README

Add at the top of `README.md`:

```markdown
## Live demo
https://YOUR-SITE.vercel.app
```

Then:

```bash
git add README.md
git commit -m "Add live demo URL"
git push
```
