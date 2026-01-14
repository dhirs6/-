// ===== グローバル =====
let player;

const input = {
  voice: { left: false, right: false },
  pose:  { left: false, right: false },
  pad:   { left: false, right: false },
  gyro:  { left: false, right: false }
};

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  canvas.width = 360;
  canvas.height = 480;

  const GRAVITY = 0.6;
  const GROUND_Y = 400;

  player = {
    x: 160,
    y: GROUND_Y,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    speed: 4,
    jump: -12,
    grounded: true
  };

  const keys = {};

  document.addEventListener('keydown', e => keys[e.code] = true);
  document.addEventListener('keyup', e => keys[e.code] = false);

  function isLeftAny() {
    return (
      keys.ArrowLeft || keys.KeyA ||
      input.voice.left ||
      input.pose.left ||
      input.pad.left ||
      input.gyro.left
    );
  }

  function isRightAny() {
    return (
      keys.ArrowRight || keys.KeyD ||
      input.voice.right ||
      input.pose.right ||
      input.pad.right ||
      input.gyro.right
    );
  }

  function isJumpKey() {
    return keys.Space;
  }

  function update() {
    if (isLeftAny()) {
      player.vx = -player.speed;
    } else if (isRightAny()) {
      player.vx = player.speed;
    } else {
      player.vx = 0;
    }

    if (isJumpKey() && player.grounded) {
      player.vy = player.jump;
      player.grounded = false;
    }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.vy = 0;
      player.grounded = true;
    }

    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#228b22';
    ctx.fillRect(0, GROUND_Y + player.h, canvas.width, 80);

    ctx.fillStyle = '#ff3333';
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
});

// ===== 音声入力 =====
window.onSpeechAction = function (action, pressed) {
  if (!player) return;

  if (action === 'left')  input.voice.left  = pressed;
  if (action === 'right') input.voice.right = pressed;

  if (action === 'jump' && pressed && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

// ===== ポーズ入力 =====
window.onPoseAction = function (action, pressed) {
  if (!player) return;

  if (action === 'left')  input.pose.left  = pressed;
  if (action === 'right') input.pose.right = pressed;

  if (action === 'jump' && pressed && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

// ===== ゲームパッド（スティック） =====
window.onGamepadAction = function (action, pressed) {
  if (!player) return;

  if (action === 'left')  input.pad.left  = pressed;
  if (action === 'right') input.pad.right = pressed;

  if (action === 'jump' && pressed && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

// ===== ジャイロ =====
window.onGyroAction = function (action, pressed) {
  if (!player) return;

  if (action === 'left')  input.gyro.left  = pressed;
  if (action === 'right') input.gyro.right = pressed;

  if (action === 'jump' && pressed && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};
