// gyro.js

let gyroEnabled = false;

/* ===== ジャイロ開始 ===== */
function startGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;

  console.log("Gyro started");

  window.addEventListener("deviceorientation", e => {
    const gamma = e.gamma || 0; // 左右（-90 ~ 90）
    const beta  = e.beta  || 0; // 前後（-180 ~ 180）

    // ===== 左右移動 =====
    window.onGyroAction?.("left",  gamma < -10);
    window.onGyroAction?.("right", gamma > 10);

    // ===== 奥に倒す → ジャンプ（連続OK）=====
    window.onGyroAction?.("jump", beta < -25);
  });
}

/* ===== 初期化 ===== */
window.addEventListener("load", () => {

  // iOS（許可が必要）
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // ★ touch.js に奪われないよう pointerdown を使う
    document.body.addEventListener(
      "pointerdown",
      async () => {
        try {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res === "granted") {
            startGyro();
          } else {
            console.warn("Gyro permission denied");
          }
        } catch (err) {
          console.error("Gyro permission error", err);
        }
      },
      { once: true }
    );

  } else {
    // Android / その他（自動で使える）
    startGyro();
  }
});
