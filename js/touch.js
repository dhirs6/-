// This is a JavaScript file
window.addEventListener('touchstart', e => {
  console.log('touchstart', e.touches.length);
}, { passive: false });

// touch.js
(() => {
  let touchLeft  = false;
  let touchRight = false;

  function handleTouch(e) {
    e.preventDefault();

    // 一旦すべて解除
    touchLeft = false;
    touchRight = false;

    const w = window.innerWidth;
    const h = window.innerHeight;

    for (const t of e.touches) {
      const x = t.clientX;
      const y = t.clientY;

      // 上 1/3 → ジャンプ
      if (y < h / 3) {
        window.onTouchAction?.('jump', true);
        continue;
      }

      // 下 2/3
      if (x < w / 2) touchLeft = true;
      else touchRight = true;
    }

    window.onTouchAction?.('left', touchLeft);
    window.onTouchAction?.('right', touchRight);
  }

  function endTouch() {
    touchLeft = false;
    touchRight = false;
    window.onTouchAction?.('left', false);
    window.onTouchAction?.('right', false);
  }

  window.addEventListener('touchstart', handleTouch, { passive: false });
  window.addEventListener('touchmove',  handleTouch, { passive: false });
  window.addEventListener('touchend',   endTouch);
  window.addEventListener('touchcancel', endTouch);
})();
