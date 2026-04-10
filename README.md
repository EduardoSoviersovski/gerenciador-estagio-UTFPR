## TO RUN WITH DOCKER

- Go to /gerenciador-estagio-UTFPR
- RUN:
```bash
docker compose build
```

- THEN RUN:
```bash
docker compose up -d
```

- To configure database, access the container:
```bash
docker-compose exec backend python scripts/init_db.py
```

- To populate database with fake data, access the container:
```bash
docker-compose exec backend python scripts/seed_database.py
```

# System Prerequisites
This project relies on Poppler for PDF rendering. It must be installed on the host system/container.

Ubuntu/Debian:

```Bash
sudo apt-get update && sudo apt-get install -y poppler-utils
```

macOS (Homebrew):

```Bash
brew install poppler
```

Windows: 
Download the latest binary from Poppler for Windows, extract the bin/ folder, and add it to your System PATH.
