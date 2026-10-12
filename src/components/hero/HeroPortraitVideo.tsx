import { useEffect, useRef } from 'react';
import { heroVideo } from '../../data/hero';
import type { HeroVideoConfig } from '../../data/hero';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Two native decoders, one portrait. Never reveal a clip until its first frame is painted. */
export function HeroPortraitVideo({ config = heroVideo }: { config?: HeroVideoConfig }) {
  const reduced = useReducedMotion();
  const surface = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLVideoElement>(null);
  const second = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = surface.current;
    const videos = [first.current, second.current];
    if (reduced || !container || !videos[0] || !videos[1]) return;
    const clips = videos as [HTMLVideoElement, HTMLVideoElement];
    const sources = [config.first, config.second];
    let topSlot = 0;
    function updateFraming(index: number, time: number) {
      const framing = config.framing[index];
      const progress = Math.min(1, Math.max(0, time / framing.endSeconds));
      // Uniform framing correction counteracts the source camera push-in.
      // No facial warping, silhouette extraction, or pixel processing.
      const scale = framing.startScale + (framing.endScale - framing.startScale) * progress;
      clips[index].style.transform = `translateY(${framing.offsetY}%) scale(${scale.toFixed(4)})`;
    }

    const failed = [false, false];
    const loaded = [false, false];
    const frameIds: (number | undefined)[] = [];
    const frameTimers: (ReturnType<typeof setTimeout> | undefined)[] = [];
    let active = 0;
    let inView = false;
    let disposed = false;
    let transitioning = false;
    let generation = 0;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const shouldPlay = () => !disposed && inView && document.visibilityState === 'visible';

    function cancelFrame(index: number) {
      if (frameIds[index] !== undefined) clips[index].cancelVideoFrameCallback?.(frameIds[index]!);
      clearTimeout(frameTimers[index]);
      frameIds[index] = undefined;
    }

    function afterFrame(index: number, callback: (time: number) => void) {
      cancelFrame(index);
      const video = clips[index];
      if (typeof video.requestVideoFrameCallback === 'function') {
        frameIds[index] = video.requestVideoFrameCallback((_now, metadata) => {
          frameIds[index] = undefined;
          if (!disposed) {
            updateFraming(index, metadata.mediaTime);
            callback(metadata.mediaTime);
          }
        });
      } else {
        // Older engines: allow a paint after loadeddata / play, never reveal an empty decoder.
        frameTimers[index] = setTimeout(() => {
          if (!disposed && video.readyState >= 2) {
            updateFraming(index, video.currentTime);
            callback(video.currentTime);
          }
        }, 45);
      }
    }

    function load(index: number) {
      if (loaded[index] || failed[index]) return;
      loaded[index] = true;
      const video = clips[index];
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.defaultPlaybackRate = config.framing[index].playbackRate;
      video.playbackRate = config.framing[index].playbackRate;
      // Metadata for the first clip; prepare the standby only near the handoff.
      video.preload = index === active ? 'metadata' : 'auto';
      video.src = sources[index];
      video.load();
    }

    function reveal(index: number) {
      if (container!.dataset.active !== String(index)) container!.dataset.active = String(index);
      if (container!.dataset.state !== 'playing') container!.dataset.state = 'playing';
    }

    function restart(index: number) {
      // Native loop uses the file's full duration, including the unsafe source tail.
      clips[index].currentTime = 0;
      // Keep the held frame's scale until afterFrame receives the decoded start frame.
      clips[index].play().catch(() => {
        if (!disposed && active === index) container!.dataset.state = 'poster';
      });
    }

    function watch(index: number) {
      if (!shouldPlay() || index !== active || clips[index].paused) return;
      afterFrame(index, () => {
        if (!shouldPlay() || index !== active) return;
        const current = clips[index];
        reveal(index);
        const next = 1 - index;
        const remaining =
          Math.min(current.duration, config.framing[index].endSeconds) - current.currentTime;
        if (Number.isFinite(remaining) && remaining <= config.preloadAheadSeconds) load(next);
        if (!transitioning && remaining <= 0.08) {
          if (!failed[next] && clips[next].readyState >= 2) handoff(next);
          else restart(index);
        }
        watch(index);
      });
    }

    function handoff(next: number) {
      if (!shouldPlay() || transitioning) return;
      transitioning = true;
      const token = ++generation;
      const outgoing = active;
      const incoming = clips[next];
      // Freeze on the safe outgoing frame even if the incoming decoder stalls.
      clips[outgoing].pause();
      cancelFrame(outgoing);
      incoming.currentTime = 0;
      updateFraming(next, 0);
      // Keep the outgoing frame until the next decoder is ready; never mix two faces.
      clips[outgoing].style.zIndex = '1';
      clips[outgoing].style.opacity = '1';
      incoming.style.zIndex = '2';
      incoming.style.opacity = '0';
      incoming
        .play()
        .then(() => {
          if (!shouldPlay() || token !== generation) return;
          afterFrame(next, () => {
            if (!shouldPlay() || token !== generation) return;
            // Hold the outgoing frame until the new decoder has painted.
            clips[outgoing].pause();
            cancelFrame(outgoing);
            active = next;
            topSlot = next;
            incoming.style.opacity = '1';
            reveal(next);
            watch(next);
            resetTimer = setTimeout(() => {
              if (disposed || token !== generation) return;
              clips[outgoing].style.opacity = '0';
              clips[outgoing].currentTime = 0;
              transitioning = false;
            }, 0);
          });
        })
        .catch(() => {
          if (disposed || token !== generation) return;
          failed[next] = true;
          transitioning = false;
          // Retry the healthy take within its safe range if the standby cannot play.
          if (shouldPlay()) restart(outgoing);
        });
    }

    function start() {
      if (!shouldPlay() || failed[active]) return;
      load(active);
      clips[active].play().catch(() => {
        // Autoplay can be denied by browser / battery policies. The poster remains usable.
        if (!disposed && clips[active].currentTime === 0) container!.dataset.state = 'poster';
      });
    }

    function suspend() {
      generation++;
      transitioning = false;
      clearTimeout(resetTimer);
      clips.forEach((clip, index) => {
        clip.style.opacity = index === active ? '1' : '0';
        clip.style.zIndex = index === topSlot ? '2' : '1';
      });
      clips.forEach((clip, index) => {
        clip.pause();
        cancelFrame(index);
      });
    }

    const cleanupListeners = clips.map((video, index) => {
      const playing = () => {
        if (!shouldPlay() || (index !== active && !transitioning)) {
          video.pause();
          return;
        }
        if (index === active) watch(index);
      };
      const ready = () => {
        if (index === active && video.paused) start();
      };
      const error = () => {
        failed[index] = true;
        cancelFrame(index);
        if (index !== active) return;
        container.dataset.state = 'poster';
        suspend();
        const other = 1 - index;
        if (!failed[other]) {
          active = other;
          topSlot = other;
          clips[other].style.opacity = '1';
          clips[other].style.zIndex = '2';
          start();
        }
      };
      video.addEventListener('playing', playing);
      video.addEventListener('canplay', ready);
      video.addEventListener('error', error);
      return () => {
        video.removeEventListener('playing', playing);
        video.removeEventListener('canplay', ready);
        video.removeEventListener('error', error);
      };
    });
    const visibility = () => {
      if (shouldPlay()) start();
      else suspend();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        visibility();
      },
      { threshold: 0, rootMargin: '30px 0px' },
    );
    observer.observe(container);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pageshow', visibility);
    window.addEventListener('pagehide', suspend);
    return () => {
      disposed = true;
      suspend();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pageshow', visibility);
      window.removeEventListener('pagehide', suspend);
      cleanupListeners.forEach((remove) => remove());
      clips.forEach((video) => {
        video.removeAttribute('src');
        video.style.removeProperty('transform');
        video.style.removeProperty('opacity');
        video.style.removeProperty('z-index');
        video.load();
      });
      container.dataset.state = 'poster';
      container.dataset.active = '0';
    };
  }, [config, reduced]);

  return (
    <div className="hero-portrait">
      <div className="portrait-scroll-layer">
        <div className="portrait-pointer-layer">
          <div className="portrait-reveal-layer">
            <div ref={surface} className="hero-portrait-media" data-state="poster" data-active="0">
              <img
                className="hero-portrait-poster"
                src={config.poster}
                srcSet={config.posterSrcSet}
                sizes="(max-width: 760px) 94vw, 720px"
                alt={config.alt}
                width="1254"
                height="1254"
                fetchPriority="high"
              />
              {!reduced && (
                <div className="portrait-video-surface" aria-hidden="true">
                  <video
                    ref={first}
                    className="portrait-video portrait-video-0"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={config.poster}
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    tabIndex={-1}
                    aria-hidden="true"
                    width="1280"
                    height="720"
                  />
                  <video
                    ref={second}
                    className="portrait-video portrait-video-1"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={config.poster}
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    tabIndex={-1}
                    aria-hidden="true"
                    width="1280"
                    height="720"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
