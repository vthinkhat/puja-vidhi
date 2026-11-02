/**
 * Play a slice of a single <audio> element when clicking .shloka-block
 * elements with data-audio-start and data-audio-end (HH:MM:SS or seconds).
 */
(function () {
    'use strict';

    var ACTIVE_CLASS = 'shloka-block-audio-active';
    var LOOP_GAP_MS = 300;

    /**
     * @param {string} value - "HH:MM:SS", "H:MM:SS.ss", or plain seconds
     * @returns {number}
     */
    function parseAudioTime(value) {
        if (value == null || value === '') {
            return NaN;
        }
        var trimmed = String(value).trim();
        if (/^\d+(\.\d+)?$/.test(trimmed)) {
            return parseFloat(trimmed, 10);
        }
        var parts = trimmed.split(':');
        if (parts.length === 3) {
            var hours = parseFloat(parts[0], 10);
            var minutes = parseFloat(parts[1], 10);
            var seconds = parseFloat(parts[2], 10);
            if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
                return NaN;
            }
            return hours * 3600 + minutes * 60 + seconds;
        }
        if (parts.length === 2) {
            var mins = parseFloat(parts[0], 10);
            var secs = parseFloat(parts[1], 10);
            if (Number.isNaN(mins) || Number.isNaN(secs)) {
                return NaN;
            }
            return mins * 60 + secs;
        }
        return NaN;
    }

    function init() {
        var audio = document.querySelector('audio[data-segment-player]');
        if (!audio) {
            return;
        }

        var blocks = document.querySelectorAll('.shloka-block[data-audio-start][data-audio-end]');
        if (!blocks.length) {
            return;
        }

        var stopAt = null;
        var segmentStart = null;
        var activeBlock = null;
        var loopGapTimeout = null;
        var segmentEndRaf = null;

        function cancelLoopGap() {
            if (loopGapTimeout != null) {
                clearTimeout(loopGapTimeout);
                loopGapTimeout = null;
            }
        }

        function cancelSegmentEndWatch() {
            if (segmentEndRaf != null) {
                cancelAnimationFrame(segmentEndRaf);
                segmentEndRaf = null;
            }
        }

        function getLoopGapMs() {
            var fromAttr = audio.getAttribute('data-segment-loop-gap-ms');
            if (fromAttr != null && fromAttr !== '') {
                var parsed = parseInt(fromAttr, 10);
                if (!Number.isNaN(parsed) && parsed >= 0) {
                    return parsed;
                }
            }
            return LOOP_GAP_MS;
        }

        var loopControl = document.querySelector('[data-segment-loop]');
        var LOOP_STORAGE_KEY = 'puja-vidhi-stotra-segment-loop';
        if (loopControl) {
            try {
                var savedLoop = localStorage.getItem(LOOP_STORAGE_KEY);
                if (savedLoop === '1') {
                    loopControl.checked = true;
                } else if (savedLoop === '0') {
                    loopControl.checked = false;
                }
            } catch (err) {
                /* ignore */
            }
            loopControl.addEventListener('change', function () {
                try {
                    localStorage.setItem(LOOP_STORAGE_KEY, loopControl.checked ? '1' : '0');
                } catch (err) {
                    /* ignore */
                }
            });
        }

        function isSegmentLoopEnabled() {
            return !!(loopControl && loopControl.checked);
        }

        function clearActive() {
            cancelLoopGap();
            cancelSegmentEndWatch();
            if (activeBlock) {
                activeBlock.classList.remove(ACTIVE_CLASS);
            }
            activeBlock = null;
            stopAt = null;
            segmentStart = null;
        }

        function restartSegmentAfterLoopGap() {
            if (!isSegmentLoopEnabled() || segmentStart == null || activeBlock == null) {
                return;
            }
            audio.currentTime = segmentStart;
            var playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () { /* autoplay blocked */ });
            }
            audio.addEventListener('timeupdate', onTimeUpdate);
            watchSegmentEnd();
        }

        function handleSegmentEnd() {
            if (stopAt == null) {
                return;
            }
            cancelSegmentEndWatch();
            audio.removeEventListener('timeupdate', onTimeUpdate);
            if (isSegmentLoopEnabled() && segmentStart != null) {
                audio.pause();
                cancelLoopGap();
                loopGapTimeout = setTimeout(function () {
                    loopGapTimeout = null;
                    restartSegmentAfterLoopGap();
                }, getLoopGapMs());
                return;
            }
            audio.pause();
        }

        function watchSegmentEnd() {
            cancelSegmentEndWatch();
            function onFrame() {
                if (stopAt == null) {
                    cancelSegmentEndWatch();
                    return;
                }
                if (audio.paused) {
                    cancelSegmentEndWatch();
                    return;
                }
                if (audio.currentTime >= stopAt - 0.02) {
                    handleSegmentEnd();
                    return;
                }
                segmentEndRaf = requestAnimationFrame(onFrame);
            }
            segmentEndRaf = requestAnimationFrame(onFrame);
        }

        function onTimeUpdate() {
            /* kept for browsers that fire timeupdate during segment play */
            if (stopAt != null && !audio.paused && audio.currentTime >= stopAt - 0.02) {
                handleSegmentEnd();
            }
        }

        blocks.forEach(function (block) {
            block.classList.add('shloka-block-audio-sync');
            if (!block.hasAttribute('tabindex')) {
                block.setAttribute('tabindex', '0');
            }
            if (!block.hasAttribute('role')) {
                block.setAttribute('role', 'button');
            }

            function playSegment() {
                var start = parseAudioTime(block.getAttribute('data-audio-start'));
                var end = parseAudioTime(block.getAttribute('data-audio-end'));
                if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
                    return;
                }

                audio.removeEventListener('timeupdate', onTimeUpdate);
                cancelLoopGap();
                clearActive();

                activeBlock = block;
                block.classList.add(ACTIVE_CLASS);
                segmentStart = start;
                stopAt = end;

                function seekAndPlay() {
                    audio.currentTime = start;
                    var playPromise = audio.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(function () { /* autoplay blocked */ });
                    }
                    audio.addEventListener('timeupdate', onTimeUpdate);
                    watchSegmentEnd();
                }

                if (audio.readyState >= 1) {
                    seekAndPlay();
                } else {
                    audio.addEventListener('loadedmetadata', seekAndPlay, { once: true });
                }
            }

            block.addEventListener('click', playSegment);
            block.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playSegment();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
