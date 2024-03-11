import { VideoAction } from "@store/videoReducer";
import { getRoundedTimePercentage } from "@utils/getRoundedNumPercentage";
import { Dispatch } from "react";

const setTrimmerPortionProps = () => {
  const { portion, startHandler, endHandler } = getTrimmerElements();

  if (!endHandler || !portion || !startHandler) return;

  portion.style.left = `${startHandler.offsetLeft}px`;
  portion.style.width = `${
    endHandler.offsetLeft - startHandler.offsetLeft + startHandler.offsetWidth
  }px`;
};

const setVideoProps = (
  videoDuration: number,
  videoDispatch: Dispatch<VideoAction>
) => {
  const { container, startHandler, endHandler } = getTrimmerElements();

  if (!container || !startHandler || !endHandler) return;

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

const getTrimmerElements = () => {
  const portion = document.getElementById("trimmer-portion");
  const container = document.getElementById("trimmer-container");
  const endHandler = document.getElementById("trimmer-end-handler");
  const startHandler = document.getElementById("trimmer-start-handler");

  return { portion, container, startHandler, endHandler };
};

export { getTrimmerElements, setTrimmerPortionProps, setVideoProps };
