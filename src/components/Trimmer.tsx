import TrimmerHandler, {
  TRIMMER_HANDLER_WIDTH,
} from "@components/TrimmerHandler";
import useTrimmer from "@hooks/useTrimmer";
import useTrimmerRefs from "@hooks/useTrimmerRefs";
import useVideo from "@hooks/useVideo";
import "@styles/trimmer.css";
import { getRoundedTimePercentage } from "@utils/getRoundedNumPercentage";
import { MouseEventHandler, useEffect, useMemo } from "react";

type DivMouseEventHandler = MouseEventHandler<HTMLDivElement>;

function Trimmer() {
  const {
    trimmerPortion: trimmerPortionRef,
    trimmerContainer,
    trimmerEndHandler,
    trimmerStartHandler,
  } = useTrimmerRefs();

  const [video, videoDispatch] = useVideo();

  const [trimmer, trimmerDispatch] = useTrimmer();

  useEffect(() => {
    trimmerDispatch({
      type: "trim",
      payload: {
        start: { x: 0 },
        end: {
          x: trimmerContainer.current!.clientWidth - TRIMMER_HANDLER_WIDTH,
        },
      },
    });
  }, [videoDispatch, trimmerContainer, trimmerDispatch]);

  const currentDraggedItem = useMemo(
    () => ({
      endHandler: trimmer.endHandler.isDragging,
      startHandler: trimmer.startHandler.isDragging,
      trimmerPortion: trimmer.trimmerPortion.isDragging,
    }),
    [trimmer]
  );

  const { startHandler, endHandler, trimmerPortion } = trimmer;

  const handleTrimmerHandlerMove: DivMouseEventHandler = (event) => {
    if (!Object.values(currentDraggedItem).some(Boolean)) return;

    let trimEndDragged = trimmer.endHandler.x;
    let trimStartDragged = trimmer.startHandler.x;

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
      trimmer.endHandler.x,
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

  const handleMouseDown: DivMouseEventHandler = (event) => {
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

  const trimmerPortionWidth =
    endHandler.x - startHandler.x + TRIMMER_HANDLER_WIDTH;

  const handleStopDragging: DivMouseEventHandler = () => {
    trimmerDispatch({ type: "stop" });
  };

  return (
    <div
      ref={trimmerContainer}
      id="trimmer-container"
      onMouseUp={handleStopDragging}
      onMouseLeave={handleStopDragging}
      onMouseMove={handleTrimmerHandlerMove}
    >
      <TrimmerHandler
        forSide="start"
        left={startHandler.x}
        ref={trimmerStartHandler}
        onMouseDown={handleMouseDown}
        data-dragging={startHandler.isDragging}
      />

      <div
        id="trimmer-portion"
        ref={trimmerPortionRef}
        style={{
          left: startHandler.x,
          width: trimmerPortionWidth,
        }}
        onMouseDown={handleMouseDown}
      />

      <TrimmerHandler
        forSide="end"
        left={endHandler.x}
        ref={trimmerEndHandler}
        onMouseDown={handleMouseDown}
        data-dragging={endHandler.isDragging}
      />
    </div>
  );
}

export default Trimmer;
