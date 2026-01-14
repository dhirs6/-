const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = e => {
  const text = e.results[e.results.length - 1][0].transcript;
  console.log('[Speech]', text);

  window.onSpeechAction('left',  text.includes('左'));
  window.onSpeechAction('right', text.includes('右'));

  if (text.includes('止')) {
    window.onSpeechAction('left', false);
    window.onSpeechAction('right', false);
  }

  if (text.includes('ジャンプ')) {
    window.onSpeechAction('jump', true);
  }
};

recognition.start();
