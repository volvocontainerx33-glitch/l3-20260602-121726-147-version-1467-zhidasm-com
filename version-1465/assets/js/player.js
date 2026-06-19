(function () {
  function setupMoviePlayer(sourceUrl) {
    var video = document.getElementById("player-video");
    var button = document.getElementById("player-button");
    var hls = null;
    var loaded = false;

    if (!video || !sourceUrl) {
      return;
    }

    function hideButton() {
      if (button) {
        button.classList.add("is-hidden");
      }
    }

    function loadStream() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.src = sourceUrl;
      }
    }

    function playVideo() {
      hideButton();
      loadStream();
      var playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    if (button) {
      button.addEventListener("click", playVideo);
    }

    video.addEventListener("play", hideButton);
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
