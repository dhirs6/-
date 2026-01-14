// camera.js

document.addEventListener('DOMContentLoaded', async () => {

  // ===== MediaPipe 読み込み =====
  const scriptPose = document.createElement('script');
  scriptPose.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
  document.head.appendChild(scriptPose);

  const scriptCam = document.createElement('script');
  scriptCam.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
  document.head.appendChild(scriptCam);

  await new Promise(r => scriptCam.onload = r);

  // ===== 非表示カメラ =====
  const video = document.createElement('video');
  video.style.display = 'none';
  document.body.appendChild(video);

  const pose = new Pose({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  // ===== ポーズ解析結果 =====
  pose.onResults(results => {
    if (!results.poseLandmarks) return;

    const lm = results.poseLandmarks;

    // 手の状態判定
    const rightHandUp = lm[16].y < lm[12].y; // 右手 < 右肩
    const leftHandUp  = lm[15].y < lm[11].y; // 左手 < 左肩

    // ===== 両手上げ → ジャンプ =====
    if (rightHandUp && leftHandUp) {
      window.onPoseAction('jump', true);
      window.onPoseAction('left', false);
      window.onPoseAction('right', false);
      return;
    }

    // ===== 右手上げ → 右移動 =====
    window.onPoseAction('right', rightHandUp);
    window.onPoseAction('left', leftHandUp);

    // ===== 両手下げ → 停止 =====
    if (!rightHandUp && !leftHandUp) {
      window.onPoseAction('left', false);
      window.onPoseAction('right', false);
    }
  });

  // ===== カメラ開始 =====
  const camera = new Camera(video, {
    onFrame: async () => {
      await pose.send({ image: video });
    },
    width: 640,
    height: 480
  });

  camera.start();
});
