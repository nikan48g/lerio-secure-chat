/**
 * Public browser helper used unchanged by chat.lerio.ir.
 * request() must be called from a direct user gesture so the browser owns the
 * Allow/Block prompt. This module never requests access on page load.
 */
(function exposeLerioMicrophone(global) {
  "use strict";

  async function permissionState() {
    if (!navigator.permissions?.query) return "prompt";
    try {
      return (await navigator.permissions.query({ name: "microphone" })).state;
    } catch {
      return "prompt";
    }
  }

  async function request() {
    if (!global.isSecureContext) {
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

  function stop(stream) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  global.LerioMicrophone = Object.freeze({ permissionState, request, stop });
})(window);
