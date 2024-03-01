import useVideo from "@hooks/useVideo";
import "@styles/video-player.css";
import { getTimeFromSeconds } from "@utils/getTimeFromSeconds";
import { useEffect, useRef, useState } from "react";
import PlayIcon from "./icons/PlayIcon";
import StopIcon from "./icons/StopIcon";

interface IPlayedLeft {
  played: string;
  left: string;
}

const defaultPlayedLeft: IPlayedLeft = {
  played: "00:00",
  left: "00:00",
};

function VideoPlayer() {
  const { video } = useVideo();
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [playedLeft, setPlayedLeft] = useState({
    ...defaultPlayedLeft,
    left: getTimeFromSeconds(video.trimEnd),
  });

  useEffect(() => {
    setPlayedLeft({
      played: getTimeFromSeconds(video.trimStart),
      left: getTimeFromSeconds(video.trimEnd),
    });

    videoPlayer.current!.currentTime = video.trimStart;
  }, [video, videoPlayer]);

  const handleTimeUpdate = () => {
    setPlayedLeft({
      ...playedLeft,
      played: getTimeFromSeconds(videoPlayer.current!.currentTime),
    });
    if (videoPlayer.current!.currentTime >= video.trimEnd) {
      videoPlayer.current!.pause();
      setIsPlaying(false);
      video;
    }
  };

  const handlePlayStopClick = () => {
    videoPlayer.current![isPlaying ? "pause" : "play"]();

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-player-container">
      <video
        width="80%"
        id="video-player"
        ref={videoPlayer}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={video.videoUrl} type="video/mp4" />
      </video>

      <div className="play-container">
        <button className="play-button" onClick={handlePlayStopClick}>
          {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>

        <span>
          {playedLeft.played} | {playedLeft.left}
        </span>
      </div>
    </div>
  );
}

export default VideoPlayer;
