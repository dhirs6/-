let gyroEnabled = false;

function startGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;

  window.addEventListener("deviceorientation", e => {
    const gamma = e.gamma || 0; // 左右
    const beta  = e.beta  || 0; // 前後

    /* ===== 左右移動 ===== */
    window.onGyroAction?.("left",  gamma < -10);
    window.onGyroAction?.("right", gamma > 10);

    /* ===== ジャンプ（奥に倒す）===== */
    window.onGyroAction?.("jump", beta < -25);
  });
}

/* iOS 対応（初回のみ必要） */
window.addEventListener("load", () => {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    document.body.addEventListener(
      "touchstart",
      async () => {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") startGyro();
      },
      { once: true }
    );
  } else {
    startGyro();
  }
});
