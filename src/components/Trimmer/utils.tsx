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
  const target = document.getElementById("trimmer-end-handler");
  if (!target) return;

  const parent = target.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - target.offsetWidth * 2;
  const calculatedMaxX = parent.offsetWidth - target.offsetWidth;

  target.style.left = `${Math.min(calculatedMaxX, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleStartHandlerMove = (event: MouseEvent) => {
  const target = document.getElementById("trimmer-start-handler");
  if (!target) return;

  const parent = target.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - target.offsetWidth * 2;

  target.style.left = `${Math.max(0, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleTrimmerPortionMove = (event: MouseEvent) => {
  const target = document.getElementById("trimmer-portion");
  const startHandler = document.getElementById("trimmer-start-handler");
  const endHandler = document.getElementById("trimmer-end-handler");
  const parent = target?.parentElement;

  if (!endHandler || !target || !startHandler || !parent) return;

  const startHandlerX = startHandler.offsetLeft + event.movementX;
  const endHandlerX = endHandler.offsetLeft + event.movementX;
  const endHandlerMaxX = parent.offsetWidth - endHandler.offsetWidth;

  const shouldStopMovement =
    endHandlerX >= endHandlerMaxX || startHandlerX <= 0;

  if (shouldStopMovement) return;

  endHandler.style.left = `${Math.min(endHandlerMaxX, endHandlerX)}px`;
  startHandler.style.left = `${Math.max(0, startHandlerX)}px`;

  setTrimmerPortionProps();
};

const setTrimmerPortionProps = () => {
  const endHandler = document.getElementById("trimmer-end-handler");
  const startHandler = document.getElementById("trimmer-start-handler");
  const trimmerPortion = document.getElementById("trimmer-portion");

  if (!endHandler || !trimmerPortion || !startHandler) return;

  trimmerPortion.style.left = `${startHandler.offsetLeft}px`;
  trimmerPortion.style.width = `${
    endHandler.offsetLeft - startHandler.offsetLeft + startHandler.offsetWidth
  }px`;
};

const updateVideoProps = (
  video: IVideo,
  videoDispatch: Dispatch<VideoAction>
) => {
  const parent = document.getElementById("trimmer-container");
  const startHandler = document.getElementById("trimmer-start-handler");
  const endHandler = document.getElementById("trimmer-end-handler");

  if (!parent || !startHandler || !endHandler) return;

  const selectedTrimStartPercentage = getRoundedTimePercentage(
    startHandler.offsetLeft,
    parent.clientWidth || 1
  );

  const selectedTrimEndPercentage = getRoundedTimePercentage(
    endHandler.offsetLeft,
    parent.clientWidth || 1
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

export {
  handleEndHandlerMove,
  handleMouseDown,
  handleStartHandlerMove,
  handleTrimmerPortionMove,
  updateVideoProps,
};
