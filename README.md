# n8n-nodes-ntfy

This is a n8n node for sending notifications via [ntfy](https://ntfy.sh/). Ntfy is a simple pub-sub notification service that lets you send push notifications to your phone or desktop via PUT/POST requests.

## Installation

```bash
# Install custom node
npm install n8n-nodes-ntfy
```

## Configuration

1. Set up ntfy credentials in n8n:
   - URL: Your ntfy server (e.g., https://ntfy.sh or self-hosted instance)
   - API Key (optional): For authenticated servers

2. Add the Ntfy node to your workflow
3. Configure:
   - Topic: The notification channel
   - Message: Your notification content
   - Title (optional): Notification title
   - Tags (optional): For categorization (e.g., warning,success)

## License

MIT