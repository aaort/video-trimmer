import TrimmerHandler, {
  TRIMMER_HANDLER_WIDTH,
} from "@components/TrimmerHandler";
import useTrimmer from "@hooks/useTrimmer";
import useTrimmerRefs from "@hooks/useTrimmerRefs";
import useVideo from "@hooks/useVideo";
import "@styles/trimmer.css";
import { useCallback, useEffect, useMemo } from "react";
import { handleMouseDown, handleMouseMove } from "./utils";

function Trimmer() {
  const {
    trimmerContainer,
    trimmerEndHandler,
    trimmerStartHandler,
    trimmerPortion: trimmerPortionRef,
  } = useTrimmerRefs();

  const [video, videoDispatch] = useVideo();

  const [trimmer, trimmerDispatch] = useTrimmer();

  const { startHandler, endHandler, trimmerPortion } = trimmer;

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
      endHandler: endHandler.isDragging,
      startHandler: startHandler.isDragging,
      trimmerPortion: trimmerPortion.isDragging,
    }),
    [endHandler.isDragging, startHandler.isDragging, trimmerPortion.isDragging]
  );

  const handleStopDragging = useCallback(
    () => trimmerDispatch({ type: "stop" }),
    [trimmerDispatch]
  );

  const trimmerMouseDownListener = useCallback(
    (event: MouseEvent) => handleMouseDown({ event, trimmer, trimmerDispatch }),
    [trimmer, trimmerDispatch]
  );

  const trimmerMouseMoveListener = useCallback(
    (event: MouseEvent) =>
      handleMouseMove({
        event,
        video,
        trimmer,
        videoDispatch,
        trimmerPortion,
        trimmerDispatch,
        trimmerContainer,
        currentDraggedItem,
      }),
    [
      currentDraggedItem,
      trimmer,
      trimmerContainer,
      trimmerDispatch,
      trimmerPortion,
      video,
      videoDispatch,
    ]
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleStopDragging);
    document.addEventListener("mousedown", trimmerMouseDownListener);
    document.addEventListener("mousemove", trimmerMouseMoveListener);

    return () => {
      document.removeEventListener("mousemove", handleStopDragging);
      document.removeEventListener("mousedown", trimmerMouseDownListener);
      document.removeEventListener("mousemove", trimmerMouseMoveListener);
    };
  }, [handleStopDragging, trimmerMouseDownListener, trimmerMouseMoveListener]);

  const trimmerPortionWidth =
    endHandler.x - startHandler.x + TRIMMER_HANDLER_WIDTH;

  return (
    <div
      ref={trimmerContainer}
      id="trimmer-container"
      onMouseUp={handleStopDragging}
    >
      <TrimmerHandler
        forSide="start"
        left={startHandler.x}
        ref={trimmerStartHandler}
        data-dragging={startHandler.isDragging}
      />

      <div
        id="trimmer-portion"
        ref={trimmerPortionRef}
        style={{
          left: startHandler.x,
          width: trimmerPortionWidth,
        }}
      />

      <TrimmerHandler
        forSide="end"
        left={endHandler.x}
        ref={trimmerEndHandler}
        data-dragging={endHandler.isDragging}
      />
    </div>
  );
}

export default Trimmer;