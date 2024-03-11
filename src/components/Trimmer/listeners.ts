import { VideoAction } from "@store/videoReducer";
import { Dispatch } from "react";
import {
  getTrimmerElements,
  setTrimmerPortionProps,
  setVideoProps,
} from "./utils";

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

const handleMouseMove = (
  event: MouseEvent,
  videoDispatch: Dispatch<VideoAction>
) => {
  const { startHandler, endHandler, portion } = getTrimmerElements();

  const target = [startHandler, endHandler, portion].find(
    (elem) => elem.getAttribute("data-dragging") === "true"
  );

  if (!target) return;

  const targetId = target.id as keyof typeof MOUSE_MOVE_LISTENERS;

  MOUSE_MOVE_LISTENERS[targetId](event);

  setVideoProps(videoDispatch);
};

const handleEndHandlerMove = (event: MouseEvent) => {
  const { endHandler } = getTrimmerElements();

  const parent = endHandler.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - endHandler.offsetWidth * 2;
  const calculatedMaxX = parent.offsetWidth - endHandler.offsetWidth;

  endHandler.style.left = `${Math.min(calculatedMaxX, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleStartHandlerMove = (event: MouseEvent) => {
  const { startHandler } = getTrimmerElements();

  const parent = startHandler.parentElement;

  if (!parent) return;

  const calculatedX = event.clientX - startHandler.offsetWidth * 2;

  startHandler.style.left = `${Math.max(0, calculatedX)}px`;

  setTrimmerPortionProps();
};

const handleTrimmerPortionMove = (event: MouseEvent) => {
  const { endHandler, startHandler, container } = getTrimmerElements();

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

const MOUSE_MOVE_LISTENERS = {
  ["trimmer-portion"]: handleTrimmerPortionMove,
  ["trimmer-end-handler"]: handleEndHandlerMove,
  ["trimmer-start-handler"]: handleStartHandlerMove,
} as const;

export {
  handleEndHandlerMove,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleStartHandlerMove,
  handleTrimmerPortionMove,
};