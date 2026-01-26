// js/touch.js

document.addEventListener('DOMContentLoaded', () => {
  const btnLeft  = document.getElementById('touch_left');
  const btnRight = document.getElementById('touch_right');
  const btnJump  = document.getElementById('touch_jump');

  if (!btnLeft  !btnRight  !btnJump) {
    console.warn('Touch buttons not found');
    return;
  }

  // ===== 共通：長押し処理 =====
  function bindHold(button, action) {
    const on = e => {
      e.preventDefault();
      console.log("input key");
      window.onTouchAction?.(action, true);
    };

    const off = e => {
      e.preventDefault();
      window.onTouchAction?.(action, false);
    };

    // タッチ
    button.addEventListener('touchstart', on, { passive: false });
    button.addEventListener('touchend', off);
    button.addEventListener('touchcancel', off);

    // マウス（PCデバッグ用）
    button.addEventListener('mousedown', on);
    button.addEventListener('mouseup', off);
    button.addEventListener('mouseleave', off);
  }

  // ===== 割り当て =====
  bindHold(btnLeft,  'left');
  bindHold(btnRight, 'right');
  bindHold(btnJump,  'jump');
});
