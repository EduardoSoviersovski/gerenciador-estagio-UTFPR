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

**Ubuntu/Debian**:

```Bash
sudo apt-get update && sudo apt-get install -y poppler-utils
```

**macOS (Homebrew)**:

```Bash
brew install poppler
```

**Windows**:

Download the latest binary from Poppler for Windows, extract the bin/ folder, and add it to your System PATH.


# Email Testing with MailCatcher
We use MailCatcher in the development environment to intercept all outgoing emails. This prevents real emails from being sent to users while allowing you to inspect the content, headers, and HTML rendering of our notification system.

## How it Works
MailCatcher runs an SMTP server on port 1025 and a web interface on port 1080. Instead of delivering mail to the internet, it catches every message and stores it in memory.

## Getting Started
- **Start the Services**: Ensure your Docker Compose stack is running

- **Access the Dashboard**: Open your browser and navigate to http://localhost:1080

- **Trigger an Email**: Send a POST request to /send_welcome_email via Postman or your frontend.
  - Body example:
    ```json
    {
      "email": "testuser@example.com",
      "name": "John Doe"
    }
    ```

- **Inspect**: The email will appear in the MailCatcher list. 
  - You can view:
    - HTML Tab: See how the email looks to a user. 
    - Source Tab: View the raw SMTP headers and MIME parts. 
    - Analysis: Check for broken links or formatting issues.

## Configuration (.env)
For the backend to communicate with MailCatcher inside the Docker network, use the following settings in your .env file:

```
SMTP_HOST=mailcatcher
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=\
SMTP_FROM_EMAIL=<email@sender.com>
```

## Troubleshooting
- **Empty Inbox**: If you send an email, and it doesn't show up, check the sisprae-backend container logs. Ensure `SMTP_HOST` is set to mailcatcher and not localhost.
- **Port Conflict**: If port 1080 is already in use on your machine, you can remap it in docker-compose.yml

```yaml
mailcatcher:
  ports:
    - "8080:1080" # New Web UI port
```
    
- **Persistence**: MailCatcher stores emails in RAM. If you restart the mailcatcher container, the inbox will be cleared.
