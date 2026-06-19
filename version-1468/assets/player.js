(function () {
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const existing = document.querySelector('script[src="' + src + '"]');
            if (existing) {
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', reject, { once: true });
                if (window.Hls) {
                    resolve();
                }
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function attachPlayer(box) {
        const video = box.querySelector('video');
        const button = box.querySelector('[data-play-button]');
        const stream = box.getAttribute('data-stream');
        let prepared = false;
        let hlsInstance = null;

        if (!video || !stream) {
            return;
        }

        function prepare() {
            if (prepared) {
                return Promise.resolve();
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return Promise.resolve();
            }
            return loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js').then(function () {
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = stream;
                }
            }).catch(function () {
                video.src = stream;
            });
        }

        function play() {
            prepare().then(function () {
                box.classList.add('playing');
                const result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {
                        box.classList.remove('playing');
                    });
                }
            });
        }

        box.addEventListener('click', function (event) {
            if (event.target === video && !video.paused) {
                return;
            }
            play();
        });

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                play();
            });
        }

        video.addEventListener('play', function () {
            box.classList.add('playing');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                box.classList.remove('playing');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(attachPlayer);
})();
