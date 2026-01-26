// js/gyro.js

let gyroEnabled = false;
let accelX = 0;
let accelY = 0;
let accelZ = 0;

// 表示用DOM
let gyroView;

// ===== 表示UIを作る =====
document.addEventListener('DOMContentLoaded', () => {
  gyroView = document.createElement('div');
  gyroView.style.position = 'absolute';
  gyroView.style.top = '80px';
  gyroView.style.left = '10px';
  gyroView.style.padding = '8px 12px';
  gyroView.style.background = 'rgba(0,0,0,0.6)';
  gyroView.style.color = '#fff';
  gyroView.style.fontSize = '14px';
  gyroView.style.borderRadius = '8px';
  gyroView.style.zIndex = '9999';
  gyroView.innerText = 'Tap to enable Gyro';

  document.body.appendChild(gyroView);

  // ===== ジャイロ許可用オーバーレイ =====
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '10000';
  overlay.style.background = 'rgba(0,0,0,0.0)'; // 完全透明
  overlay.style.touchAction = 'none'; // ← 超重要

  document.body.appendChild(overlay);

  overlay.addEventListener(
    'touchstart',
    async (e) => {
      e.preventDefault(); // ゲーム側に渡さない
      await requestGyroPermission();
      overlay.remove(); // 役目終了
    },
    { once: true, passive: false }
  );
});

// ===== iOS 権限要求 =====
async function requestGyroPermission() {
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    const res = await DeviceMotionEvent.requestPermission();
    if (res !== 'granted') {
      gyroView.innerText = 'Gyro permission denied';
      return;
    }
  }

  startGyro();
}

// ===== 加速度取得 =====
function startGyro() {
  if (gyroEnabled) return;
  gyroEnabled = true;

  window.addEventListener('devicemotion', onDeviceMotion);
  gyroView.innerText = 'Gyro enabled';
}

// ===== センサイベント =====
function onDeviceMotion(e) {
  if (!e.accelerationIncludingGravity) return;

  accelX = e.accelerationIncludingGravity.x || 0;
  accelY = e.accelerationIncludingGravity.y || 0;
  accelZ = e.accelerationIncludingGravity.z || 0;

  // 表示更新
  gyroView.innerText =
    'Gyro (Accel)\n' +
    'X: ' + accelX.toFixed(2) + '\n' +
    'Y: ' + accelY.toFixed(2) + '\n' +
    'Z: ' + accelZ.toFixed(2);

  // ===== ゲーム操作に変換 =====
  const TH = 2.0;

  window.onGyroAction?.('left',  accelX < -TH);
  window.onGyroAction?.('right', accelX >  TH);

  // 奥に倒す → ジャンプ（連続OK）
  window.onGyroAction?.('jump', accelZ > -7);
}
