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
    trimmerPortion,
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

  const handleTrimmerHandlerMove: DivMouseEventHandler = (event) => {
    if (!Object.values(currentDraggedItem).some(Boolean)) return;

    let trimEndDragged = trimmer.endHandler.x;
    let trimStartDragged = trimmer.startHandler.x;

    if (currentDraggedItem.trimmerPortion) {
      trimEndDragged = trimmer.endHandler.x + event.movementX;
      trimStartDragged = trimmer.startHandler.x + event.movementX;
    } else if (currentDraggedItem.startHandler) {
      trimStartDragged = event.clientX - trimmer.startHandler.initialX;
    } else if (currentDraggedItem.endHandler) {
      trimEndDragged = event.clientX - trimmer.endHandler.initialX;
    }

    if (trimEndDragged - trimStartDragged <= TRIMMER_HANDLER_WIDTH) {
      return;
    }

    const reachedStart =
      trimStartDragged <= trimmerContainer.current!.clientLeft;
    const reachedEnd =
      trimEndDragged >=
      trimmerContainer.current!.clientLeft +
        trimmerContainer.current!.clientWidth -
        TRIMMER_HANDLER_WIDTH;

    if (trimmer.trimmerPortion.isDragging && (reachedStart || reachedEnd)) {
      return;
    }

    if (trimmer.startHandler.isDragging && reachedStart) {
      return;
    }

    if (trimmer.endHandler.isDragging && reachedEnd) return;

    trimmerDispatch({
      type: "trim",
      payload: {
        start: {
          x: trimStartDragged,
        },
        end: {
          x: trimEndDragged,
        },
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

    let endHandlerInitialX = trimmer.endHandler.initialX;
    let startHandlerInitialX = trimmer.startHandler.initialX;

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
        start: {
          initialX: startHandlerInitialX,
        },
        end: {
          initialX: endHandlerInitialX,
        },
      },
    });
  };

  const trimmerPortionWidth =
    trimmer.endHandler.x - trimmer.startHandler.x + TRIMMER_HANDLER_WIDTH;

  const handleMouseUp: DivMouseEventHandler = () => {
    const selectedTrimStartPercentage = getRoundedTimePercentage(
      trimmer.startHandler.x,
      trimmerContainer.current?.clientWidth || 1
    );

    const selectedTrimEndPercentage = getRoundedTimePercentage(
      trimmer.endHandler.x,
      trimmerContainer.current?.clientWidth || 1
    );

    const selectedTrimStartTime =
      (video.videoDuration * selectedTrimStartPercentage) / 100;
    const selectedTrimEndTime =
      (video.videoDuration * selectedTrimEndPercentage) / 100;

    videoDispatch({
      type: "trim",
      payload: {
        end: selectedTrimEndTime,
        start: selectedTrimStartTime,
      },
    });

    trimmerDispatch({ type: "stop" });
  };

  return (
    <div
      ref={trimmerContainer}
      id="trimmer-container"
      onMouseUp={handleMouseUp}
      onMouseMove={handleTrimmerHandlerMove}
      onMouseLeave={() => trimmerDispatch({ type: "stop" })}
    >
      <TrimmerHandler
        forSide="start"
        ref={trimmerStartHandler}
        left={trimmer.startHandler.x}
        onMouseDown={handleMouseDown}
        data-dragging={trimmer.startHandler.isDragging}
      />

      <div
        id="trimmer-portion"
        ref={trimmerPortion}
        style={{
          width: trimmerPortionWidth,
          left: trimmer.startHandler.x,
        }}
        onMouseDown={handleMouseDown}
      />

      <TrimmerHandler
        forSide="end"
        ref={trimmerEndHandler}
        left={trimmer.endHandler.x}
        onMouseDown={handleMouseDown}
        data-dragging={trimmer.endHandler.isDragging}
      />
    </div>
  );
}

export default Trimmer;
