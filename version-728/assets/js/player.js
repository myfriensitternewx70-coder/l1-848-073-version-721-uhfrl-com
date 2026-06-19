(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var play = player.querySelector("[data-play]");
    var stream = video ? video.getAttribute("data-stream") : "";
    var loaded = false;
    var hls = null;

    var attach = function () {
      if (!video || !stream || loaded) {
        return Promise.resolve();
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        loaded = true;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        loaded = true;
        return Promise.resolve();
      }

      video.src = stream;
      loaded = true;
      return Promise.resolve();
    };

    var start = function () {
      attach().then(function () {
        player.classList.add("is-playing");
        video.controls = true;
        var request = video.play();
        if (request && request.catch) {
          request.catch(function () {});
        }
      });
    };

    if (play) {
      play.addEventListener("click", start);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener("play", function () {
        player.classList.add("is-playing");
      });
    }
  });
})();
