// touch.js
(() => {
  let touchLeft  = false;
  let touchRight = false;

  const canvas = document.getElementById('game');
  if (!canvas) {
    console.error('game canvas not found');
    return;
  }

  function handleTouch(e) {
    e.preventDefault();

    // 一旦すべて解除
    touchLeft = false;
    touchRight = false;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    for (const t of e.touches) {
      // canvas 内座標に変換
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;

      // canvas 外は無視
      if (x < 0 || y < 0 || x > w || y > h) continue;

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

  // canvas にのみイベントを張る
  canvas.addEventListener('touchstart', handleTouch, { passive: false });
  canvas.addEventListener('touchmove',  handleTouch, { passive: false });
  canvas.addEventListener('touchend',   endTouch);
  canvas.addEventListener('touchcancel', endTouch);
})();
