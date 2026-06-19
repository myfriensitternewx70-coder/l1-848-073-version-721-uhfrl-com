import { H as Hls } from './hls-dru42stk.js';

function bindVideo(video) {
  const url = video.dataset.playUrl;
  if (!url) {
    return null;
  }

  let hls = null;

  if (Hls && Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data || !data.fatal) {
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      }
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  }

  return hls;
}

function setupPlayers() {
  const videos = Array.from(document.querySelectorAll('.js-hls-video'));
  videos.forEach((video) => {
    bindVideo(video);
    const frame = video.closest('.video-frame');
    const overlay = frame ? frame.querySelector('.js-player-overlay') : null;
    if (!overlay) {
      return;
    }

    const play = () => {
      overlay.classList.add('is-hidden');
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          overlay.classList.remove('is-hidden');
        });
      }
    };

    overlay.addEventListener('click', play);
    video.addEventListener('play', () => overlay.classList.add('is-hidden'));
    video.addEventListener('pause', () => {
      if (video.currentTime === 0 || video.ended) {
        overlay.classList.remove('is-hidden');
      }
    });
  });
}

setupPlayers();
