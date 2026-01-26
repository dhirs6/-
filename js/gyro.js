// gyro.js（iOS最終対応版）

let gyroEnabled = false;

/* ===== ジャイロ開始 ===== */
function startGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;

  console.log("Gyro started");

  window.addEventListener("deviceorientation", e => {
    const gamma = e.gamma || 0; // 左右
    const beta  = e.beta  || 0; // 前後

    // 左右移動
    window.onGyroAction?.("left",  gamma < -10);
    window.onGyroAction?.("right", gamma > 10);

    // 奥に倒す → ジャンプ（連続OK）
    window.onGyroAction?.("jump", beta < -25);
  });
}

/* ===== 初期化 ===== */
window.addEventListener("load", () => {

  // iOS（許可必須）
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {

    document.addEventListener(
      "pointerdown",
      async e => {
        // ★ ここが最重要
        e.preventDefault();
        e.stopImmediatePropagation();

        try {
          const res = await DeviceOrientationEvent.requestPermission();
          console.log("Gyro permission:", res);

          if (res === "granted") {
            startGyro();
          }
        } catch (err) {
          console.error("Gyro permission error", err);
        }
      },
      {
        once: true,
        capture: true   // ★ touch.js より先に取る
      }
    );

  } else {
    // Android / その他
    startGyro();
  }
});
