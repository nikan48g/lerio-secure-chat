/**
 * Browser microphone permission helper used by Lerio's consent-first recording UI.
 * It never starts recording on page load and never requests permission without a
 * direct user action.
 */
export async function microphonePermissionState() {
  if (!navigator.permissions?.query) return "prompt";
  try {
    return (await navigator.permissions.query({ name: "microphone" })).state;
  } catch {
    return "prompt";
  }
}

export async function requestMicrophone() {
  if (!window.isSecureContext) {
    throw new DOMException("Microphone access requires HTTPS", "SecurityError");
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("Microphone capture is not supported", "NotSupportedError");
  }
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
}

export function stopMicrophone(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

