import {
  generateConversationKey,
  encryptMessage,
  decryptMessage,
  encryptAttachment,
  decryptAttachment,
} from "../src/e2ee/crypto.js";

const metadata = { conversationId: 42, epoch: 1, senderDeviceId: "test-device", counter: 1 };
const message = "پیام آزمایشی لریو 🐆";
const key = await generateConversationKey();
const envelope = await encryptMessage(key, message, metadata);
const recovered = await decryptMessage(key, envelope);
if (recovered !== message || envelope.ciphertext.includes(message)) throw new Error("message vector failed");

const sourceFile = new TextEncoder().encode("private attachment bytes");
const fileMetadata = { conversationId: 42, epoch: 1, name: "proof.txt", size: sourceFile.length };
const encryptedFile = await encryptAttachment(key, sourceFile, fileMetadata);
const recoveredFile = await decryptAttachment(key, encryptedFile, fileMetadata);
if (new TextDecoder().decode(recoveredFile) !== new TextDecoder().decode(sourceFile)) throw new Error("attachment vector failed");

console.log(JSON.stringify({
  status: "PASS",
  suite: envelope.suite,
  plaintextVisibleInCiphertext: envelope.ciphertext.includes(message),
  messageRoundTrip: recovered === message,
  attachmentRoundTrip: true,
}));
