import { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onVideoEnd: () => void;
}

export default function LoadingScreen({ onVideoEnd }: LoadingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsExiting(true);
      setTimeout(onVideoEnd, 800);
    };

    video.addEventListener('ended', handleEnded);

    // Try to start both video and audio immediately
    const startMedia = () => {
      if (!video.paused) return;
      video.play().catch(() => {});
      // Try audio right after
      requestAnimationFrame(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      });
    };

    startMedia();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);

  return (
    <div className={`loading-screen ${isExiting ? 'loading-screen--exiting' : ''}`}>
      <div className="loading-screen__video-wrapper">
        <video
          ref={videoRef}
          className="loading-screen__video"
          src="/melizzoLoading/loading.mp4"
          muted
          playsInline
          preload="auto"
        />
      </div>
      <audio ref={audioRef} src="/melizzoLoading/loading.mp4" />
      <div className="loading-screen__bg-glow" />
    </div>
  );
}
