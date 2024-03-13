import { getPlayerElements } from "@components/VideoPlayer/utils";
import { VideoAction } from "@store/videoReducer";
import { Dispatch } from "react";

const HANDLER_WIDTH = 20;

const updateTrimmerPortion = () => {
  const { portion, startHandler, endHandler } = getTrimmerElements();

  portion.style.left = `${startHandler.offsetLeft}px`;
  portion.style.width = `${
    endHandler.offsetLeft - startHandler.offsetLeft + HANDLER_WIDTH
  }px`;
};

function getRoundedTimePercentage(num: number, baseNum: number) {
  return Math.round((num / baseNum) * 100);
}

const updateVideo = (videoDispatch: Dispatch<VideoAction>) => {
  const { container, startHandler, endHandler } = getTrimmerElements();
  const { videoPlayer } = getPlayerElements();

  const videoDuration = videoPlayer.duration;

  const trimStartPercentage = getRoundedTimePercentage(
    startHandler.offsetLeft,
    container.clientWidth
  );

  const trimEndPercentage = getRoundedTimePercentage(
    endHandler.offsetLeft,
    container.clientWidth
  );

  const trimEndTime = (videoDuration * trimEndPercentage) / 100;
  const trimStartTime = (videoDuration * trimStartPercentage) / 100;

  videoDispatch({
    type: "trim",
    payload: {
      end: trimEndTime,
      start: trimStartTime,
    },
  });
};

const getTrimmerElements = () => {
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

  return { portion, container, startHandler, endHandler } as const;
};

export { HANDLER_WIDTH, getTrimmerElements, updateTrimmerPortion, updateVideo };
