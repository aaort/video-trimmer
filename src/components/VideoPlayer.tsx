import useVideo from "@hooks/useVideo";
import "@styles/video-player.css";
import { getTimeFromSeconds } from "@utils/getTimeFromSeconds";
import { useEffect, useRef, useState } from "react";
import Loader from "./icons/Loader";
import PlayIcon from "./icons/PlayIcon";
import StopIcon from "./icons/StopIcon";

interface IPlayedLeft {
  left: string;
  played: string;
}

const defaultPlayedLeft: IPlayedLeft = {
  left: "00:00",
  played: "00:00",
};

function VideoPlayer() {
  const [video] = useVideo();
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlayDisabled, setIsPlayDisabled] = useState<boolean>(false);

  const [playedLeft, setPlayedLeft] = useState({
    ...defaultPlayedLeft,
    left: getTimeFromSeconds(video.trimEnd),
  });

  useEffect(() => {
    if (isLoading) return;
    if (videoPlayer.current!.currentTime < video.trimEnd) {
      setIsPlayDisabled(false);
    }
  }, [isLoading, video]);

  useEffect(() => {
    if (isLoading) return;
    setPlayedLeft({
      left: getTimeFromSeconds(video.trimEnd),
      played: getTimeFromSeconds(video.trimStart),
    });

    videoPlayer.current!.currentTime = video.trimStart;
  }, [isLoading, video, videoPlayer]);

  const handleTimeUpdate = () => {
    setPlayedLeft({
      ...playedLeft,
      played: getTimeFromSeconds(videoPlayer.current!.currentTime),
    });

    if (videoPlayer.current!.currentTime >= video.trimEnd) {
      setIsPlaying(false);
      setIsPlayDisabled(true);
      videoPlayer.current!.pause();
    }
  };

  const handlePlayStopClick = () => {
    videoPlayer.current![isPlaying ? "pause" : "play"]();

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-player-container">
      <div className="video-player-wrapper">
        {isLoading && (
          <div id="video-player-loading">
            <Loader />
          </div>
        )}

        <video
          id="video-player"
          ref={videoPlayer}
          hidden={isLoading}
          src={video.videoUrl}
          data-loading={isLoading}
          onTimeUpdate={handleTimeUpdate}
          onLoadStart={() => setIsLoading(true)}
          onLoadedMetadata={() => setIsLoading(false)}
        />
      </div>

      <div className="play-container">
        <button
          className="play-button"
          disabled={isPlayDisabled}
          onClick={handlePlayStopClick}
        >
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
