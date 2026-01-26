// ===== グローバル =====
let player;
let platforms = [];
let cameraY = 0; // ★ カメラ

const input = {
  voice: { left: false, right: false },
  pose:  { left: false, right: false },
  pad:   { left: false, right: false },
  gyro:  { left: false, right: false }
};

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  canvas.width = 360;
  canvas.height = 480;

  const GRAVITY = 0.6;
  const GROUND_Y = 400;

  // ===== プレイヤー =====
  player = {
    x: 160,
    y: GROUND_Y - 30,
    prevY: GROUND_Y - 30,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    speed: 4,
    jump: -12,
    grounded: false
  };

  // ===== キーボード =====
  const keys = {};
  document.addEventListener('keydown', e => keys[e.code] = true);
  document.addEventListener('keyup',   e => keys[e.code] = false);

  // ===== JSON 足場読み込み =====
  const res = await fetch('json/ashba.json');
  const data = await res.json();

  platforms = data.map(p => ({
    x: p.x,
    y: p.y,
    w: p.w,
    h: 10
  }));

  // ===== 入力統合 =====
  function isLeftAny() {
    return keys.ArrowLeft || keys.KeyA ||
           input.voice.left || input.pose.left ||
           input.pad.left || input.gyro.left;
  }

  function isRightAny() {
    return keys.ArrowRight || keys.KeyD ||
           input.voice.right || input.pose.right ||
           input.pad.right || input.gyro.right;
  }

  function isJumpAny() {
    return keys.Space;
  }

  // ===== 更新 =====
  function update() {
    player.prevY = player.y;

    // 横移動
    if (isLeftAny()) player.vx = -player.speed;
    else if (isRightAny()) player.vx = player.speed;
    else player.vx = 0;

    // ジャンプ
    if (isJumpAny() && player.grounded) {
      player.vy = player.jump;
      player.grounded = false;
    }

    // 重力
    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;

    player.grounded = false;

    // ===== 足場判定（上からのみ）=====
    platforms.forEach(p => {
      const prevBottom = player.prevY + player.h;
      const currBottom = player.y + player.h;

      const falling = player.vy > 0;
      const wasAbove = prevBottom <= p.y;
      const overlapX =
        player.x + player.w > p.x &&
        player.x < p.x + p.w;

      if (falling && wasAbove && overlapX && currBottom >= p.y) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.grounded = true;
      }
    });

    // 地面
    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.vy = 0;
      player.grounded = true;
    }

    // 横制限
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

    // ===== ★ カメラ追従（完全に player 基準）=====
    cameraY = player.y - canvas.height / 2 + player.h / 2;
    // ★ clamp は一切しない（重要）
  }

  // ===== 描画 =====
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ===== 背景（高さ依存 + グラデーション）=====
    const maxHeight = 2000;
    const height = Math.max(0, GROUND_Y - player.y);
    const t = Math.min(1, height / maxHeight);

    const baseR = (135 * t);
    const baseG = (206 * t);
    const baseB = (235 * t);

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, `rgb(
      ${Math.min(255, baseR + 30)},
      ${Math.min(255, baseG + 30)},
      ${Math.min(255, baseB + 30)}
    )`);
    grad.addColorStop(1, `rgb(
      ${Math.max(0, baseR - 30)},
      ${Math.max(0, baseG - 30)},
      ${Math.max(0, baseB - 30)}
    )`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 足場
    ctx.fillStyle = '#DE0000';
    platforms.forEach(p => {
      ctx.fillRect(p.x, p.y - cameraY, p.w, p.h);
    });

    // 地面
    ctx.fillStyle = '#228b22';
    ctx.fillRect(0, GROUND_Y + player.h - cameraY, canvas.width, 80);

    // プレイヤー
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(
      player.x,
      player.y - cameraY,
      player.w,
      player.h
    );
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
});

// ===== 外部入力（ジャンプ含む）=====
window.onSpeechAction = (a, p) => {
  if (!player) return;
  if (a === 'left')  input.voice.left  = p;
  if (a === 'right') input.voice.right = p;
  if (a === 'jump' && p && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

window.onPoseAction = (a, p) => {
  if (!player) return;
  if (a === 'left')  input.pose.left  = p;
  if (a === 'right') input.pose.right = p;
  if (a === 'jump' && p && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

window.onGamepadAction = (a, p) => {
  if (!player) return;
  if (a === 'left')  input.pad.left  = p;
  if (a === 'right') input.pad.right = p;
  if (a === 'jump' && p && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};

window.onGyroAction = (a, p) => {
  if (!player) return;
  if (a === 'left')  input.gyro.left  = p;
  if (a === 'right') input.gyro.right = p;
  if (a === 'jump' && p && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }
};
