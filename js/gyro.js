let gyroEnabled = false;

function startGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;

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

window.addEventListener("load", () => {
  // iOS 判定
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    //  カメラと同じ「ページ開いたら即使える感」を作る
    document.body.addEventListener(
      "touchstart",
      async () => {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") startGyro();
      },
      { once: true }
    );
  } else {
    // Android / その他 → 自動開始
    startGyro();
  }
});
