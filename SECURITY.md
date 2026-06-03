# Security Policy

Smart Agro AI is an MVP in active development. Please do not use it with real farm, customer, payment, or credential data until the security model is hardened.

## Reporting a Vulnerability

Do not open public issues for secrets, credential leaks, authentication bypasses, or data exposure.

Report security concerns privately to the maintainers. If no private contact is available yet, prepare a minimal reproduction and wait for a maintainer contact channel to be published before disclosing sensitive details.

## Secret Handling

- Never commit `.env` files.
- Never commit API keys, database files, password hashes, tokens, or user records.
- Rotate any secret that was ever committed, even if it was later removed.

## Current MVP Limitations

- Authentication is suitable for demo use only.
- Admin authorization is not production-ready.
- Local SQLite databases are for development only and are ignored by git.
- The Virtual Agronom is currently a frontend mock, not a production AI advisor.
