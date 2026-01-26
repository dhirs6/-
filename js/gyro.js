let dualSense = null;

/* DualSense 接続 */
async function connectDualSense() {
  if (!("hid" in navigator)) {
    console.error("WebHID is not supported");
    return;
  }

  const devices = await navigator.hid.requestDevice({
    filters: [{ vendorId: 0x054C }]
  });

  if (devices.length === 0) {
    console.warn("DualSense not found");
    return;
  }

  dualSense = devices[0];
  await dualSense.open();

  console.log("DualSense connected");

  dualSense.addEventListener("inputreport", onInputReport);
}

/* 入力レポート受信 */
function onInputReport(event) {
  const data = event.data;

  const accelX = data.getInt16(14, true);
  const accelY = data.getInt16(16, true);
  const accelZ = data.getInt16(18, true);

  console.clear();
  console.log("Acceleration (raw)");
  console.log("X:", accelX);
  console.log("Y:", accelY);
  console.log("Z:", accelZ);
}

/* ページ読み込み後にボタン1つで開始できるようにする */
window.addEventListener("load", () => {
  console.log("Click anywhere to connect DualSense");

  document.body.addEventListener("click", async () => {
    if (!dualSense) {
      await connectDualSense();
    }
  }, { once: true });
});
