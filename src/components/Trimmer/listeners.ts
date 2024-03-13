import { VideoAction } from "@store/videoReducer";
import { Dispatch } from "react";
import {
  HANDLER_WIDTH,
  getTrimmerElements,
  updateTrimmerPortion,
  updateVideo,
} from "./utils";

const handleMouseDown = (event: MouseEvent) => {
  const target = event.target as HTMLDivElement;

  target.setAttribute("data-dragging", "true");
};

const handleMouseUp = () => {
  const { endHandler, startHandler, portion } = getTrimmerElements();

  for (const element of [endHandler, startHandler, portion]) {
    element!.setAttribute("data-dragging", "false");
  }
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

  updateVideo(videoDispatch);
};

const handleEndHandlerMove = (event: MouseEvent) => {
  const { endHandler, container, startHandler } = getTrimmerElements();

  const calculatedX = event.clientX - HANDLER_WIDTH * 2;
  const calculatedMaxX = container.offsetWidth - HANDLER_WIDTH;

  const areHandlersTooClose =
    calculatedX - startHandler.offsetLeft <= HANDLER_WIDTH;

  if (areHandlersTooClose) return;

  endHandler.style.left = `${Math.min(calculatedMaxX, calculatedX)}px`;

  updateTrimmerPortion();
};

const handleStartHandlerMove = (event: MouseEvent) => {
  const { startHandler, endHandler } = getTrimmerElements();

  const calculatedX = event.clientX - HANDLER_WIDTH * 2;

  const areHandlersTooClose =
    endHandler.offsetLeft - calculatedX <= HANDLER_WIDTH;

  if (areHandlersTooClose) return;

  startHandler.style.left = `${Math.max(0, calculatedX)}px`;

  updateTrimmerPortion();
};

const handleTrimmerPortionMove = (event: MouseEvent) => {
  const { endHandler, startHandler, container } = getTrimmerElements();

  const endHandlerX = endHandler.offsetLeft + event.movementX;
  const startHandlerX = startHandler.offsetLeft + event.movementX;
  const endHandlerMaxX = container.offsetWidth - HANDLER_WIDTH;

  const shouldStopMovement =
    endHandlerX >= endHandlerMaxX || startHandlerX <= 0;

  if (shouldStopMovement) return;

  startHandler.style.left = `${Math.max(0, startHandlerX)}px`;
  endHandler.style.left = `${Math.min(endHandlerMaxX, endHandlerX)}px`;

  updateTrimmerPortion();
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
