import { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onVideoEnd: () => void;
}

export default function LoadingScreen({ onVideoEnd }: LoadingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsExiting(true);
      setTimeout(onVideoEnd, 800);
    };

    video.addEventListener('ended', handleEnded);
    video.play().catch(() => {});

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
          src="/melizzoLoading/MELiZZO_brand_reveal_202603301031.mp4"
          muted
          playsInline
          preload="auto"
        />
      </div>
      <div className="loading-screen__bg-glow" />
    </div>
  );
}
