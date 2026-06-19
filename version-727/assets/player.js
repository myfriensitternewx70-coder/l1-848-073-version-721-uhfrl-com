(function () {
    var hlsLoading = null;

    function loadRemoteHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsLoading) {
            return hlsLoading;
        }
        hlsLoading = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return hlsLoading;
    }

    function attachSource(video, source) {
        if (video.dataset.ready === '1') {
            return Promise.resolve();
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.dataset.ready = '1';
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video.dataset.ready = '1';
            return Promise.resolve();
        }
        return loadRemoteHls().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video.dataset.ready = '1';
            } else {
                video.src = source;
                video.dataset.ready = '1';
            }
        });
    }

    function setup(video) {
        var source = video.getAttribute('data-source');
        var shell = video.closest('.player-shell');
        var button = shell ? shell.querySelector('[data-play-button]') : null;
        if (!source) {
            return;
        }

        function start() {
            attachSource(video, source).then(function () {
                var played = video.play();
                if (played && typeof played.then === 'function') {
                    played.catch(function () {});
                }
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }

        if (button) {
            button.addEventListener('click', start);
        }
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (button && video.currentTime === 0) {
                button.classList.remove('is-hidden');
            }
        });
        attachSource(video, source);
    }

    function init() {
        Array.prototype.slice.call(document.querySelectorAll('.player-video')).forEach(setup);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
