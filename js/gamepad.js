let padIndex = null;

window.addEventListener("gamepadconnected", e => {
  padIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", () => {
  padIndex = null;
});

function gamepadLoop() {
  if (padIndex !== null) {
    const gp = navigator.getGamepads()[padIndex];
    if (gp) {
      const x = gp.axes[0];
      const y = gp.axes[1];

      window.onGamepadAction('right', x > 0.3);
      window.onGamepadAction('left',  x < -0.3);

      if (y < -0.7) {
        window.onGamepadAction('jump', true);
      }
    }
  }
  requestAnimationFrame(gamepadLoop);
}

gamepadLoop();
