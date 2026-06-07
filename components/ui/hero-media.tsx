"use client";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

function HeroMedia({ className, ...props }: ComponentPropsWithoutRef<"video">) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.8;
  }, []);

  const startPlayback = () => {
    void videoRef.current?.play().catch(() => undefined);
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onLoadedData={startPlayback}
      onCanPlay={startPlayback}
      className={cn(
        "absolute inset-0 z-0 h-full w-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

export { HeroMedia };
