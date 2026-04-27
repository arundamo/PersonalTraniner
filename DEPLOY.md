# Deployment Guide – Personal Trainer

This guide covers running the app locally and deploying it to three popular free/low-cost cloud platforms: **Railway**, **Render**, and **Fly.io**.

---

## 1. Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/arundamo/PersonalTraniner.git
cd PersonalTraniner

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open **http://localhost:3000** in your browser.  
The REST API is available at **http://localhost:3000/api/**.

> **Note:** Data is stored in memory. It resets every time the server restarts. See the [Persistence](#persistence) section for options.

---

## 2. Deploy to Railway

[Railway](https://railway.app) offers a generous free tier and deploys directly from GitHub.

### Steps

1. Push your code to a GitHub repository.
2. Go to [railway.app](https://railway.app) and sign in with GitHub.
3. Click **New Project → Deploy from GitHub repo**.
4. Select your repository.
5. Railway auto-detects Node.js and uses `npm start` as the start command.
6. Under **Settings → Networking**, click **Generate Domain** to get a public URL.

Your app will be live at the generated URL (e.g. `https://personaltrainer-production.up.railway.app`).

### Environment variables (optional)

| Variable | Default | Description         |
|----------|---------|---------------------|
| `PORT`   | `3000`  | Port the server binds to (Railway sets this automatically) |

---

## 3. Deploy to Render

[Render](https://render.com) provides a free Web Service tier.

### Steps

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) and sign up / sign in.
3. Click **New → Web Service**.
4. Connect your GitHub repository.
5. Set the following:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Click **Create Web Service**.

Render provides a URL like `https://personal-trainer.onrender.com`.

> **Free tier note:** Free web services on Render spin down after 15 minutes of inactivity and take ~30 seconds to wake up on the next request.

---

## 4. Deploy to Fly.io

[Fly.io](https://fly.io) runs your app in lightweight VMs close to your users.

### Prerequisites

```bash
# Install the Fly CLI
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Steps

```bash
# In the project root:
fly launch
# Follow the prompts:
#   - App name: personal-trainer (or any unique name)
#   - Region: choose the closest to you
#   - Dockerfile: No (Fly will use the Node buildpack)
#   - Deploy now: Yes

# On subsequent deploys:
fly deploy
```

Fly creates a `fly.toml` in the project root. Commit it to your repository.  
Your app is accessible at `https://<app-name>.fly.dev`.

---

## 5. Docker (self-hosted or any cloud)

### Create a `Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

### Build & run locally

```bash
docker build -t personal-trainer .
docker run -p 3000:3000 personal-trainer
```

### Deploy to any container platform

Push the image to Docker Hub or a cloud registry, then deploy with your platform's standard workflow (e.g. AWS ECS, Google Cloud Run, Azure Container Apps).

---

## 6. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | The port the HTTP server listens on |

Set variables in your platform's dashboard or in a `.env` file (not committed to Git).

---

## 7. Persistence

The default store is **in-memory**: all data is lost when the process restarts.  
For a production deployment, replace `src/data/store.js` with a persistent backend:

- **SQLite** – lightweight, single-file database; great for small deployments.
- **PostgreSQL / MySQL** – recommended for multi-instance or high-traffic deployments.
- **MongoDB** – document store that maps naturally to the existing JSON models.

Most cloud platforms listed above offer managed database add-ons (e.g. Railway PostgreSQL, Render PostgreSQL, Fly.io Postgres).

---

## 8. Running Tests

```bash
npm test
```

Jest tests run against the in-memory store and do not require a running server.
