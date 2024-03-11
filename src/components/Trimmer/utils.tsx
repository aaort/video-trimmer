import {
  TrimmerAction,
  TrimmerState,
} from "@components/Trimmer/hooks/useTrimmer";
import { TRIMMER_HANDLER_WIDTH } from "@components/TrimmerHandler";
import { IVideo } from "@store/index";
import { VideoAction } from "@store/videoReducer";
import { getRoundedTimePercentage } from "@utils/getRoundedNumPercentage";
import { Dispatch } from "react";

interface HandleMouseDownProps {
  event: MouseEvent;
  trimmer: TrimmerState;
  trimmerDispatch: Dispatch<TrimmerAction>;
}

const handleMouseDown = (props: HandleMouseDownProps) => {
  const { event, trimmer, trimmerDispatch } = props;
  const { startHandler, endHandler } = trimmer;

  const target = event.target as HTMLDivElement;
  const targetId = target.id;

  const isDraggingTrimmerPortion = targetId === "trimmer-portion";
  const isDraggingEndHandler = targetId === "trimmer-end-handler";
  const isDraggingStartHandler = targetId === "trimmer-start-handler";

  trimmerDispatch({
    type: "drag",
    payload: {
      endDragging: isDraggingEndHandler,
      startDragging: isDraggingStartHandler,
      trimmerPortionDragging: isDraggingTrimmerPortion,
    },
  });

  const targetRect = target.getBoundingClientRect();

  let endHandlerInitialX = endHandler.initialX;
  let startHandlerInitialX = startHandler.initialX;

  if (isDraggingStartHandler) {
    startHandlerInitialX =
      targetRect.left +
      targetRect.width -
      event.clientX +
      TRIMMER_HANDLER_WIDTH;
  }

  if (isDraggingEndHandler) {
    endHandlerInitialX =
      targetRect.left +
      targetRect.width -
      event.clientX +
      TRIMMER_HANDLER_WIDTH * 2;
  }

  trimmerDispatch({
    type: "trim",
    payload: {
      end: {
        initialX: endHandlerInitialX,
      },
      start: {
        initialX: startHandlerInitialX,
      },
    },
  });
};

const handleEndHandlerMove = (event: MouseEvent) => {
  const { endHandler } = getTrimmerElements();
  if (!endHandler) return;

  const parent = endHandler.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - endHandler.offsetWidth * 2;
  const calculatedMaxX = parent.offsetWidth - endHandler.offsetWidth;

  endHandler.style.left = `${Math.min(calculatedMaxX, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleStartHandlerMove = (event: MouseEvent) => {
  const { startHandler } = getTrimmerElements();
  if (!startHandler) return;

  const parent = startHandler.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - startHandler.offsetWidth * 2;

  startHandler.style.left = `${Math.max(0, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleTrimmerPortionMove = (event: MouseEvent) => {
  const { endHandler, startHandler, portion, container } = getTrimmerElements();

  if (!endHandler || !portion || !startHandler || !container) return;

  const startHandlerX = startHandler.offsetLeft + event.movementX;
  const endHandlerX = endHandler.offsetLeft + event.movementX;
  const endHandlerMaxX = container.offsetWidth - endHandler.offsetWidth;

  const shouldStopMovement =
    endHandlerX >= endHandlerMaxX || startHandlerX <= 0;

  if (shouldStopMovement) return;

  endHandler.style.left = `${Math.min(endHandlerMaxX, endHandlerX)}px`;
  startHandler.style.left = `${Math.max(0, startHandlerX)}px`;

  setTrimmerPortionProps();
};

const setTrimmerPortionProps = () => {
  const { portion, startHandler, endHandler } = getTrimmerElements();

  if (!endHandler || !portion || !startHandler) return;

  portion.style.left = `${startHandler.offsetLeft}px`;
  portion.style.width = `${
    endHandler.offsetLeft - startHandler.offsetLeft + startHandler.offsetWidth
  }px`;
};

const updateVideoProps = (
  video: IVideo,
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

  const selectedTrimEndTime =
    (video.videoDuration * selectedTrimEndPercentage) / 100;
  const selectedTrimStartTime =
    (video.videoDuration * selectedTrimStartPercentage) / 100;

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

export {
  handleEndHandlerMove,
  handleMouseDown,
  handleStartHandlerMove,
  handleTrimmerPortionMove,
  updateVideoProps,
};
