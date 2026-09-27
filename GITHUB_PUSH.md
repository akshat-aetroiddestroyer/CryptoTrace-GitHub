# How to push CryptoTrace to GitHub (step by step)

## Prerequisites

1. A GitHub account: https://github.com/signup  
2. Git installed on your computer: https://git-scm.com/downloads  
3. (Optional) GitHub CLI: https://cli.github.com/

---

## Step 1 — Download this project folder

Use the zip from this conversation (`CryptoTrace-GitHub.zip`) and extract it, **or** copy the folder `CryptoTrace-GitHub` to your machine.

Your folder should look like:

```
CryptoTrace-GitHub/
├── index.html          ← main demo website (open this)
├── README.md
├── LICENSE
├── .gitignore
├── GITHUB_PUSH.md
├── extension/          ← Chrome/Edge extension (load unpacked)
│   ├── manifest.json
│   ├── content.js
│   ├── background.js
│   ├── warn.css
│   └── popup.html
├── docs/
└── web-app/            ← React source (optional)
```

---

## Step 2 — Create a new repository on GitHub

1. Go to https://github.com/new  
2. **Repository name:** `CryptoTrace` (or `cryptotrace-sih-2026`)  
3. Description: `AI-Powered Crypto Fraud Tracing & Prevention — SIH 2026`  
4. Set to **Public** (or Private)  
5. **Do not** check “Add a README” (we already have one)  
6. Click **Create repository**

GitHub will show you a URL like:

`https://github.com/YOUR_USERNAME/CryptoTrace.git`

---

## Step 3 — Open a terminal in the project folder

```bash
cd path/to/CryptoTrace-GitHub
```

---

## Step 4 — Initialize Git and make the first commit

```bash
git init
git add .
git status
git commit -m "Initial commit: CryptoTrace SIH 2026 demo, extension, and docs"
```

If Git asks for your name/email once:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Then run the `git commit` again.

---

## Step 5 — Connect to GitHub and push

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CryptoTrace.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Authentication

- **HTTPS:** GitHub may ask for a **Personal Access Token** (not your password).  
  Create one: GitHub → Settings → Developer settings → Personal access tokens.  
- **SSH (optional):**  
  `git remote set-url origin git@github.com:YOUR_USERNAME/CryptoTrace.git`

---

## Step 6 — Verify

Open:

`https://github.com/YOUR_USERNAME/CryptoTrace`

You should see `README.md`, `index.html`, and `extension/`.

---

## Optional — GitHub Pages (one-click website from the repo)

1. Repo → **Settings** → **Pages**  
2. Source: **Deploy from a branch**  
3. Branch: `main` / folder: `/ (root)`  
4. Save  

After a minute, your site will be at:

`https://YOUR_USERNAME.github.io/CryptoTrace/`

(`index.html` at the repo root is the demo.)

---

## Optional — later updates

```bash
cd path/to/CryptoTrace-GitHub
# edit files...
git add .
git commit -m "Describe your change"
git push
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `remote origin already exists` | `git remote remove origin` then add again |
| Auth failed | Use a Personal Access Token or SSH key |
| Large files rejected | Ensure `node_modules` is not committed (covered by `.gitignore`) |
| Empty repo on GitHub | Confirm `git push -u origin main` completed without errors |

---

## What judges / visitors should open

1. **Live demo:** `index.html` (or GitHub Pages URL)  
2. **Extension code:** `extension/` + load unpacked in Chrome  
3. **Product overview:** `README.md`
