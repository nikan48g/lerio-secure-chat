const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

export async function generateConversationKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function exportConversationKey(key) {
  return new Uint8Array(await crypto.subtle.exportKey("raw", key));
}

export async function importConversationKey(raw) {
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export function messageAad({ conversationId, epoch, senderDeviceId, counter }) {
  return encoder.encode(`lerio-e2ee-v1|${conversationId}|${epoch}|${senderDeviceId}|${counter}`);
}

export async function encryptMessage(key, plaintext, metadata) {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce, additionalData: messageAad(metadata), tagLength: 128 },
    key,
    encoder.encode(plaintext),
  );
  return {
    v: 1,
    suite: "lerio-e2ee-v1",
    ...metadata,
    nonce: bytesToBase64Url(nonce),
    ciphertext: bytesToBase64Url(new Uint8Array(ciphertext)),
  };
}

export async function decryptMessage(key, envelope) {
  if (envelope.v !== 1 || envelope.suite !== "lerio-e2ee-v1") throw new Error("Unsupported E2EE envelope");
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(envelope.nonce), additionalData: messageAad(envelope), tagLength: 128 },
    key,
    base64UrlToBytes(envelope.ciphertext),
  );
  return decoder.decode(plaintext);
}

export async function encryptAttachment(key, bytes, metadata) {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const aad = encoder.encode(`lerio-file-v1|${metadata.conversationId}|${metadata.epoch}|${metadata.name}|${metadata.size}`);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData: aad, tagLength: 128 }, key, bytes);
  return { nonce: bytesToBase64Url(nonce), ciphertext: new Uint8Array(ciphertext), aad: bytesToBase64Url(aad) };
}

export async function decryptAttachment(key, encrypted, metadata) {
  const aad = encoder.encode(`lerio-file-v1|${metadata.conversationId}|${metadata.epoch}|${metadata.name}|${metadata.size}`);
  return new Uint8Array(await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(encrypted.nonce), additionalData: aad, tagLength: 128 }, key, encrypted.ciphertext,
  ));
}

export { bytesToBase64Url, base64UrlToBytes };

