# Lerio Secure Chat — public security components

This repository contains security-sensitive components and design documents that
Lerio can publish for independent review without exposing its private application,
credentials, infrastructure, or user data.

## Current, honest security status

- Microphone access is user initiated and controlled by the browser's native
  Allow/Block permission prompt; Lerio shows recovery guidance only after denial.
- `src/microphone-consent.js` is served by the production Chat UI and invokes the
  browser's native Allow/Block prompt directly from the microphone button click.
- Lerio uses HTTPS in production and restricts microphone and camera permissions
  to the same origin.
- The production chat is **not yet end-to-end encrypted**. The server can currently
  process message plaintext. We will not display an E2EE claim until the protocol,
  key verification, multi-device behavior, backup behavior, and an independent
  review are complete.
- Authentication, authorization, transport security, and E2EE are separate
  controls; none is presented as a substitute for another.

## Public roadmap

1. Publish threat model and protocol proposal.
2. Build a versioned Web Crypto client with test vectors.
3. Add per-device identity keys, signed prekeys, session rotation, and QR/safety-number verification.
4. Encrypt message bodies and attachments before upload; keep private keys off the server.
5. Commission an independent review, publish findings, and remediate them.
6. Enable E2EE only for conversations that pass migration and device verification checks.

Security issues should be reported privately as described in [SECURITY.md](SECURITY.md).

## License

MIT. The Lerio name and artwork are not granted as trademarks by this license.
