# Threat model and E2EE acceptance criteria

## Protected data

Message text, attachments, voice notes, conversation membership, device identity,
and encryption keys. Metadata minimization is a separate goal from content encryption.

## In scope

- Passive and active network attackers
- A compromised or curious application server
- Stolen session cookies and unauthorized conversation access
- Malicious message/attachment content
- Lost devices and revoked devices

## Not automatically solved by E2EE

Compromised endpoints, screenshots, recipients forwarding content, traffic metadata,
weak account recovery, and malicious browser extensions.

## Required before Lerio may claim E2EE

- Encryption and decryption occur only on participant devices.
- The server never receives conversation private keys or message plaintext.
- New devices cannot silently join an encrypted conversation.
- Users can compare QR codes or safety numbers.
- Key changes are visible and have a documented blocking/warning policy.
- Attachments and voice notes are encrypted client-side with unique keys.
- Replay, reordering, deletion, and downgrade behavior have tests.
- Backups state clearly whether they are encrypted and how recovery keys work.
- Published test vectors pass across supported clients.
- An independent review has no unresolved critical finding.

