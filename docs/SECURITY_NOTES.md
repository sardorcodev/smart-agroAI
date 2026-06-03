# Security Notes

Smart Agro AI is an MVP and should not be used with real production users, payments, secrets, or farm-critical decisions yet.

## Secrets

- Never commit `.env` files.
- Never commit API keys, tokens, database URLs with credentials, password hashes, or user records.
- Use `.env.example` files for variable names only.
- Rotate any secret that was ever committed.

## Local Databases

Local SQLite files are development artifacts and are ignored by git:

- `*.db`
- `*.sqlite`
- `*.sqlite3`

Do not commit demo users, real users, password hashes, or admin accounts.

## API Keys

`GEMINI_API_KEY` is documented only as a future integration variable. The current Virtual Agronom UI is mocked and does not require a real API key.

## Current Auth Limitations

- Login/register are demo-only.
- No JWT/session system is implemented yet.
- Admin access is not protected by backend authorization.
- Do not use this auth model in production.

## Responsible Disclosure

Use `SECURITY.md` for the current vulnerability reporting policy. Do not disclose exploitable security details in public issues.
