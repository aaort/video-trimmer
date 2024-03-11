import { VideoAction } from "@store/videoReducer";
import { Dispatch } from "react";

const setTrimmerPortionProps = () => {
  const { portion, startHandler, endHandler } = getTrimmerElements();

  portion.style.left = `${startHandler.offsetLeft}px`;
  portion.style.width = `${
    endHandler.offsetLeft - startHandler.offsetLeft + startHandler.offsetWidth
  }px`;
};

function getRoundedTimePercentage(num: number, baseNum: number) {
  return Math.round((num / baseNum) * 100);
}

const setVideoProps = (videoDispatch: Dispatch<VideoAction>) => {
  const { container, startHandler, endHandler } = getTrimmerElements();
  const videoPlayer = document.getElementById(
    "video-player"
  ) as HTMLVideoElement;

  const videoDuration = videoPlayer.duration;

  const selectedTrimStartPercentage = getRoundedTimePercentage(
    startHandler.offsetLeft,
    container.clientWidth || 1
  );

  const selectedTrimEndPercentage = getRoundedTimePercentage(
    endHandler.offsetLeft,
    container.clientWidth || 1
  );

  const selectedTrimEndTime = (videoDuration * selectedTrimEndPercentage) / 100;
  const selectedTrimStartTime =
    (videoDuration * selectedTrimStartPercentage) / 100;

  videoDispatch({
    type: "trim",
    payload: {
      end: selectedTrimEndTime,
      start: selectedTrimStartTime,
    },
  });
};

const getTrimmerElements = (): Record<string, HTMLDivElement> => {
  const portion = document.getElementById("trimmer-portion") as HTMLDivElement;
  const container = document.getElementById(
    "trimmer-container"
  ) as HTMLDivElement;
  const endHandler = document.getElementById(
    "trimmer-end-handler"
  ) as HTMLDivElement;
  const startHandler = document.getElementById(
    "trimmer-start-handler"
  ) as HTMLDivElement;

  return { portion, container, startHandler, endHandler };
};

export { getTrimmerElements, setTrimmerPortionProps, setVideoProps };
