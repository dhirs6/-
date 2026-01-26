// js/touch_button.js

document.addEventListener('DOMContentLoaded', () => {
  const btnLeft  = document.getElementById('touch_left');
  const btnRight = document.getElementById('touch_right');
  const btnJump  = document.getElementById('touch_jump');

  if (!btnLeft  !btnRight 
 !btnJump) return;

  // ===== 共通ユーティリティ =====
  function bindHold(button, action) {
    const on = e => {
      e.preventDefault();
      window.onGyroAction(action, true);
    };

    const off = e => {
      e.preventDefault();
      window.onGyroAction(action, false);
    };

    button.addEventListener('touchstart', on, { passive: false });
    button.addEventListener('touchend', off);
    button.addEventListener('touchcancel', off);

    // PCデバッグ用
    button.addEventListener('mousedown', on);
    button.addEventListener('mouseup', off);
    button.addEventListener('mouseleave', off);
  }

  // ===== 左右移動（長押し）=====
  bindHold(btnLeft,  'left');
  bindHold(btnRight, 'right');

  // ===== ジャンプ（長押しOK）=====
  bindHold(btnJump, 'jump');
});
