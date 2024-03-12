import Loader from "@icons/Loader";
import PlayIcon from "@icons/Play";
import Stop from "@icons/Stop";
import VideoPrevious from "@icons/VideoPrevious";
import useVideo from "@store/hook";
import "@styles/video-player.css";
import { useEffect, useRef, useState } from "react";
import { getPlayerElements, getTimeFromSeconds } from "./utils";

interface IPlayedLeft {
  left: string;
  played: string;
}

const defaultPlayedLeft: IPlayedLeft = {
  left: "00:00",
  played: "00:00",
};

function VideoPlayer() {
  const [video, videoDispatch] = useVideo();
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [playedLeft, setPlayedLeft] = useState({
    ...defaultPlayedLeft,
    left: getTimeFromSeconds(video.trimEnd),
  });

  useEffect(() => {
    if (isLoading) return;
    const { videoPlayer } = getPlayerElements();

    const onVideoURLChange = () => {
      videoDispatch({ type: "set-duration", payload: videoPlayer.duration });
    };

    videoPlayer.addEventListener("durationchange", onVideoURLChange);

    return () => {
      videoPlayer.removeEventListener("durationchange", onVideoURLChange);
    };
  }, [isLoading, video.videoUrl, videoDispatch]);

  useEffect(() => {
    if (isLoading) return;
    const { videoPlayer, playButton } = getPlayerElements();

    setPlayedLeft({
      left: getTimeFromSeconds(video.trimEnd),
      played: getTimeFromSeconds(video.trimStart),
    });

    playButton.disabled = !(videoPlayer.currentTime <= video.trimEnd);
    videoPlayer.currentTime = video.trimStart;
  }, [isLoading, video]);

  const handleTimeUpdate = () => {
    const { playButton, replayButton, videoPlayer } = getPlayerElements();

    setPlayedLeft({
      ...playedLeft,
      played: getTimeFromSeconds(videoPlayer.currentTime),
    });

    // Player current time reached the trim end time
    if (videoPlayer.currentTime >= video.trimEnd) {
      playButton.disabled = true;
      videoPlayer.pause();
    }

    replayButton.disabled = !(videoPlayer.currentTime > video.trimStart);
  };

  const handleReplay = () => {
    const { playButton, videoPlayer } = getPlayerElements();

    playButton.disabled = false;
    videoPlayer.currentTime = video.trimStart;
  };

  const handlePlayStopClick = () => {
    const { videoPlayer } = getPlayerElements();

    videoPlayer[!videoPlayer.paused ? "pause" : "play"]();
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
          hidden={isLoading}
          src={video.videoUrl}
          ref={videoPlayerRef}
          data-loading={isLoading}
          onTimeUpdate={handleTimeUpdate}
          onLoadStart={() => setIsLoading(true)}
          onLoadedMetadata={() => setIsLoading(false)}
        />
      </div>

      <div className="player-actions">
        <button
          id="replay-button"
          onClick={handleReplay}
          className="player-action-button"
        >
          <VideoPrevious />
        </button>

        <button
          id="play-button"
          onClick={handlePlayStopClick}
          className="player-action-button"
        >
          {videoPlayerRef.current?.paused ? <PlayIcon /> : <Stop />}
        </button>

        <span>
          {playedLeft.played} | {playedLeft.left}
        </span>
      </div>
    </div>
  );
}

export default VideoPlayer;
