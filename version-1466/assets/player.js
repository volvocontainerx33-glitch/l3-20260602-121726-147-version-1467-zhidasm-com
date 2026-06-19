(function () {
    function createMoviePlayer(source) {
        var video = document.querySelector('[data-video-player]');
        var cover = document.querySelector('[data-play-cover]');
        var button = document.querySelector('[data-play-button]');
        var loaded = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function bindSource() {
            if (loaded) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            loaded = true;
        }

        function playVideo() {
            bindSource();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', playVideo);
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                playVideo();
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.createMoviePlayer = createMoviePlayer;
})();
