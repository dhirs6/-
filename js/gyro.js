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
  gyroView.innerText = 'Gyro: not started';

  document.body.appendChild(gyroView);

  // ユーザー操作必須（iOS）
  document.body.addEventListener('click', requestGyroPermission, { once: true });
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
  window.addEventListener('devicemotion', onDeviceMotion);
  gyroEnabled = true;
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
  const TH = 2.0; // しきい値（調整用）

  // 左右傾き
  window.onGyroAction('left',  accelX < -TH);
  window.onGyroAction('right', accelX >  TH);
}
