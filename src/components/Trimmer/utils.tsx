import { TRIMMER_HANDLER_WIDTH } from "@components/TrimmerHandler";
import { TrimmerAction, TrimmerState } from "@hooks/useTrimmer";
import { IVideo } from "@store/index";
import { VideoAction } from "@store/reducers";
import { getRoundedTimePercentage } from "@utils/getRoundedNumPercentage";
import { Dispatch, RefObject } from "react";

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

interface HandleMouseMoveProps extends HandleMouseDownProps {
  video: IVideo;
  videoDispatch: Dispatch<VideoAction>;
  trimmerContainer: RefObject<HTMLDivElement>;
  currentDraggedItem: Record<string, boolean>;
  trimmerPortion: TrimmerState["trimmerPortion"];
}

const handleMouseMove = (props: HandleMouseMoveProps) => {
  const {
    event,
    video,
    trimmer,
    videoDispatch,
    trimmerPortion,
    trimmerDispatch,
    trimmerContainer,
    currentDraggedItem,
  } = props;

  const { startHandler, endHandler } = trimmer;

  if (!Object.values(currentDraggedItem).some(Boolean)) return;

  let trimEndDragged = endHandler.x;
  let trimStartDragged = startHandler.x;

  const { clientX, movementX } = event;

  if (currentDraggedItem.trimmerPortion) {
    trimEndDragged = endHandler.x + movementX;
    trimStartDragged = startHandler.x + movementX;
  } else if (currentDraggedItem.startHandler) {
    trimStartDragged = clientX - startHandler.initialX;
  } else if (currentDraggedItem.endHandler) {
    trimEndDragged = clientX - endHandler.initialX;
  }

  if (trimEndDragged - trimStartDragged <= TRIMMER_HANDLER_WIDTH) {
    return;
  }

  const trimContainer = trimmerContainer.current!;

  const reachedStart = trimStartDragged <= trimContainer.clientLeft;
  const reachedEnd =
    trimEndDragged >=
    trimContainer.clientLeft +
      trimContainer.clientWidth -
      TRIMMER_HANDLER_WIDTH;

  if (trimmerPortion.isDragging && (reachedStart || reachedEnd)) {
    return;
  }

  if (startHandler.isDragging && reachedStart) {
    return;
  }

  if (endHandler.isDragging && reachedEnd) return;

  trimmerDispatch({
    type: "trim",
    payload: {
      end: {
        x: trimEndDragged,
      },
      start: {
        x: trimStartDragged,
      },
    },
  });

  const selectedTrimStartPercentage = getRoundedTimePercentage(
    startHandler.x,
    trimContainer.clientWidth || 1
  );

  const selectedTrimEndPercentage = getRoundedTimePercentage(
    endHandler.x,
    trimContainer.clientWidth || 1
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

export { handleMouseDown, handleMouseMove };
