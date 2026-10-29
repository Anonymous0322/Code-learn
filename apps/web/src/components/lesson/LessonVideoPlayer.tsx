'use client';

import { useEffect, useId, useRef } from 'react';

interface LessonVideoPlayerProps {
  videoUrl?: string;
  title: string;
  onEnded: () => void;
}

type YouTubePlayer = { destroy: () => void };
type YouTubeApi = { Player: new (element: string, options: Record<string, unknown>) => YouTubePlayer };
declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function youtubeId(value: string) {
  try {
    const url = new URL(value);
    const id = url.hostname.endsWith('youtu.be')
      ? url.pathname.slice(1)
      : url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function LessonVideoPlayer({ videoUrl, title, onEnded }: LessonVideoPlayerProps) {
  const playerId = `lesson-video-${useId().replace(/:/g, '')}`;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const onEndedRef = useRef(onEnded);
  const youtubeVideoId = videoUrl ? youtubeId(videoUrl) : null;

  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

  useEffect(() => {
    if (!youtubeVideoId) return;
    let cancelled = false;
    const mountPlayer = () => {
      if (cancelled || !window.YT || playerRef.current) return;
      playerRef.current = new window.YT.Player(playerId, {
        videoId: youtubeVideoId,
        playerVars: { origin: window.location.origin, rel: 0 },
        events: { onStateChange: (event: { data: number }) => { if (event.data === 0) onEndedRef.current(); } },
      });
    };

    if (window.YT) mountPlayer();
    else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previousCallback?.(); mountPlayer(); };
      if (!document.querySelector('script[data-lesson-youtube-api]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.lessonYoutubeApi = 'true';
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [playerId, youtubeVideoId]);

  if (!videoUrl) return <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-[#090e1b] p-6 text-center text-sm text-slate-400">Bu darsga video hali qo‘shilmagan.</div>;
  if (youtubeVideoId) return <div className="overflow-hidden rounded-2xl border border-white/10 bg-black"><div id={playerId} className="aspect-video w-full" title={title} /></div>;

  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
    <video className="aspect-video w-full" src={videoUrl} controls playsInline preload="metadata" onEnded={onEnded} aria-label={title}>
      Brauzeringiz video formatini qo‘llab-quvvatlamaydi.
    </video>
  </div>;
}
