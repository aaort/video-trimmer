import useTrimmerRefs from "@components/Trimmer/hooks/useTrimmerRefs";
import TrimmerHandler from "@components/TrimmerHandler";
import useVideo from "@hooks/useVideo";
import "@styles/trimmer.css";
import { useCallback, useEffect, useMemo } from "react";
import useTrimmerOnWindowResize from "./hooks/useTrimmerOnWindowResize";
import {
  handleEndHandlerMove,
  handleMouseDown,
  handleStartHandlerMove,
  handleTrimmerPortionMove,
  updateVideoProps,
} from "./utils";

function Trimmer() {
  const {
    trimmerContainer,
    trimmerEndHandler,
    trimmerStartHandler,
    trimmerPortion: trimmerPortionRef,
  } = useTrimmerRefs();

  const [video, videoDispatch] = useVideo();

  const [trimmer, trimmerDispatch] = useTrimmerOnWindowResize();

  const { startHandler, endHandler, trimmerPortion } = trimmer;

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

  useEffect(() => {
    const trimmerMouseMoveListener = (event: MouseEvent) => {
      if (currentDraggedItem.endHandler) {
        handleEndHandlerMove(event);
        updateVideoProps(video, videoDispatch);
      } else if (currentDraggedItem.startHandler) {
        handleStartHandlerMove(event);
        updateVideoProps(video, videoDispatch);
      } else if (currentDraggedItem.trimmerPortion) {
        handleTrimmerPortionMove(event);
        updateVideoProps(video, videoDispatch);
      }
    };

    document.addEventListener("mouseup", handleStopDragging);
    document.addEventListener("mousedown", trimmerMouseDownListener);
    document.addEventListener("mousemove", trimmerMouseMoveListener);

    return () => {
      document.removeEventListener("mousemove", handleStopDragging);
      document.removeEventListener("mousedown", trimmerMouseDownListener);
      document.removeEventListener("mousemove", trimmerMouseMoveListener);
    };
  }, [
    currentDraggedItem,
    handleStopDragging,
    trimmerMouseDownListener,
    video,
    videoDispatch,
  ]);

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

      <div id="trimmer-portion" ref={trimmerPortionRef} />

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
