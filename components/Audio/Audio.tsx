import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Audio.module.css";

type Song = {
  id: number;
  title: string;
  artist: string;
  file: string;
  image: string;
};

export default function Audio(props: {
  isPlaying: boolean;
  setIsPlaying: Function;
  songs: Song[];
  trackPlaying: number;
  setTrackPlaying: Function;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeSongInfo, setTimeSongInfo] = useState<{
    currentTime: number;
    duration: number;
  }>({
    currentTime: 0,
    duration: 0,
  });

  useEffect(() => {
    if (props.isPlaying) {
      const playing =
        audioRef.current &&
        audioRef.current.currentTime > 0 &&
        !audioRef.current.paused &&
        !audioRef.current.ended &&
        audioRef.current.readyState > audioRef.current.HAVE_CURRENT_DATA;
      if (audioRef.current && !playing) audioRef.current.play();
    } else {
      if (audioRef.current) audioRef.current.pause();
    }
  }, [props.isPlaying, props.trackPlaying]);

  const getNextOrPreviousTrack = (step: string): number => {
    let thisTrackPlaying = props.trackPlaying;
    let numberTracks = props.songs.length;
    if (step === "previous") {
      if (props.trackPlaying !== 0) {
        thisTrackPlaying--;
      } else {
        thisTrackPlaying = numberTracks - 1;
      }
    } else if (step === "next") {
      if (props.trackPlaying !== numberTracks - 1) {
        thisTrackPlaying++;
      } else {
        thisTrackPlaying = 0;
      }
    }
    return thisTrackPlaying;
  };

  const handlePreviousOrNext = (step: string): void => {
    let nextTrackPlaying = getNextOrPreviousTrack(step);
    props.setTrackPlaying(nextTrackPlaying);
  };

  const handlePlayPause = (): void => {
    if (props.isPlaying) {
      props.setIsPlaying(false);
    } else {
      props.setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (e: SyntheticEvent<EventTarget>): void => {
    const current = (e.target as HTMLMediaElement).currentTime;
    const duration = (e.target as HTMLMediaElement).duration;

    if (current === duration) {
      handlePreviousOrNext("next");
    } else {
      let timeSong = {
        currentTime: current,
        duration,
      };
      setTimeSongInfo(timeSong);
    }
  };

  const getTime = (time: number): string => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const handleDragging = (e: SyntheticEvent<EventTarget>): void => {
    if (audioRef.current)
      audioRef.current.currentTime = parseInt(
        (e.target as HTMLInputElement).value
      );
    setTimeSongInfo({
      ...timeSongInfo,
      currentTime: parseInt((e.target as HTMLInputElement).value),
    });
  };

  function onKeyDown(event: KeyboardEvent) {
    if (audioRef.current) {
      switch (event.key) {
        case " ":
          event.preventDefault();
          handlePlayPause();
          document.removeEventListener("keydown", onKeyDown);
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlePreviousOrNext("previous");
          document.removeEventListener("keydown", onKeyDown);
          break;
        case "ArrowRight":
          event.preventDefault();
          handlePreviousOrNext("next");
          document.removeEventListener("keydown", onKeyDown);
          break;
      }
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", onKeyDown);
  }

  return (
    <>
      <div className={styles.rangeInfos}>
        <p>{getTime(timeSongInfo.currentTime)}</p>
        <input
          type="range"
          className={styles.range}
          min={0}
          max={timeSongInfo.duration.toString()}
          value={timeSongInfo.currentTime}
          onChange={handleDragging}
        />
        <p>{getTime(timeSongInfo.duration)}</p>
      </div>
      <div className={styles.controls}>
        <audio
          ref={audioRef}
          src={props.songs[props.trackPlaying].file}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
        />
        <FiChevronLeft
          size={24}
          onClick={() => handlePreviousOrNext("previous")}
        />
        {props.isPlaying ? (
          <FiPause size={24} onClick={() => handlePlayPause()} />
        ) : (
          <FiPlay size={24} onClick={() => handlePlayPause()} />
        )}
        <FiChevronRight
          size={24}
          onClick={() => handlePreviousOrNext("next")}
        />
      </div>
    </>
  );
}
