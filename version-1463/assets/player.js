async function loadHlsModule() {
  try {
    const module = await import('./hls.js');
    return module.H;
  } catch (error) {
    return null;
  }
}

async function attachPlayer(box) {
  const video = box.querySelector('video[data-src]');
  const button = box.querySelector('[data-play-button]');

  if (!video || !button) {
    return;
  }

  const source = video.getAttribute('data-src');
  let prepared = false;

  async function prepare() {
    if (prepared || !source) {
      return;
    }
    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    const Hls = await loadHlsModule();
    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }

    video.src = source;
  }

  async function play() {
    await prepare();
    box.classList.add('playing');
    try {
      await video.play();
    } catch (error) {
      box.classList.remove('playing');
    }
  }

  button.addEventListener('click', play);
  video.addEventListener('play', function () {
    box.classList.add('playing');
  });
  video.addEventListener('pause', function () {
    if (video.currentTime === 0) {
      box.classList.remove('playing');
    }
  });
}

document.querySelectorAll('[data-player-box]').forEach(function (box) {
  attachPlayer(box);
});
