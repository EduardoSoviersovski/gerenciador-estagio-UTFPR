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
