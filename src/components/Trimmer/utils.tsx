import { VideoAction } from "@store/videoReducer";
import { getRoundedTimePercentage } from "@utils/getRoundedNumPercentage";
import { Dispatch } from "react";

const handleMouseDown = (event: MouseEvent) => {
  const target = event.target as HTMLDivElement;

  target.setAttribute("data-dragging", "true");
};

const handleMouseUp = () => {
  const { endHandler, startHandler, portion } = getTrimmerElements();

  [endHandler, portion, startHandler].filter(Boolean).forEach((elem) => {
    elem!.setAttribute("data-dragging", "false");
  });
};

const handleMouseMove = (event: MouseEvent) => {
  const { startHandler, endHandler, portion } = getTrimmerElements();

  if (!startHandler || !endHandler || !portion) return;

  const target = [startHandler, endHandler, portion].filter(
    (elem) => elem.getAttribute("data-dragging") === "true"
  )[0];

  if (!target) return;

  const targetId = target.id as keyof typeof MOUSE_MOVE_LISTENERS;

  MOUSE_MOVE_LISTENERS[targetId](event);
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

const MOUSE_MOVE_LISTENERS = {
  ["trimmer-portion"]: handleTrimmerPortionMove,
  ["trimmer-end-handler"]: handleEndHandlerMove,
  ["trimmer-start-handler"]: handleStartHandlerMove,
} as const;

export {
  getTrimmerElements,
  handleEndHandlerMove,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleStartHandlerMove,
  handleTrimmerPortionMove,
  setVideoProps,
};
