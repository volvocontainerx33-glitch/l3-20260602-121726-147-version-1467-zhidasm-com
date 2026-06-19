import { H as Hls } from "./hls-vendor.js";

export function initMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var source = options.source;
    var hls = null;
    var ready = false;

    if (!video || !source) {
        return;
    }

    function attachSource() {
        if (ready) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }

        ready = true;
    }

    function startPlayback() {
        attachSource();

        if (button) {
            button.classList.add("is-hidden");
        }

        var playback = video.play();

        if (playback && typeof playback.catch === "function") {
            playback.catch(function () {
                if (button) {
                    button.classList.remove("is-hidden");
                }
            });
        }
    }

    if (button) {
        button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener("play", function () {
        if (button) {
            button.classList.add("is-hidden");
        }
    });

    video.addEventListener("ended", function () {
        if (button) {
            button.classList.remove("is-hidden");
        }
    });

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
