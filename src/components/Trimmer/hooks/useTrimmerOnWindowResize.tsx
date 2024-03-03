import useTrimmer, {
  TrimmerAction,
  TrimmerState,
} from "@components/Trimmer/hooks/useTrimmer";
import { TRIMMER_HANDLER_WIDTH } from "@components/TrimmerHandler";
import { Dispatch, useCallback, useEffect } from "react";

function useTrimmerOnWindowResize(): [TrimmerState, Dispatch<TrimmerAction>] {
  const [trimmer, trimmerDispatch] = useTrimmer();

  const updateDefaultVideoTrim = useCallback(() => {
    const trimmerContainer = document.getElementById("trimmer-container");

    trimmerDispatch({
      type: "trim",
      payload: {
        start: { x: 0 },
        end: {
          x: trimmerContainer!.clientWidth - TRIMMER_HANDLER_WIDTH,
        },
      },
    });
  }, [trimmerDispatch]);

  useEffect(() => {
    updateDefaultVideoTrim();
  }, [updateDefaultVideoTrim]);

  useEffect(() => {
    window.addEventListener("resize", updateDefaultVideoTrim);

    return () => {
      window.removeEventListener("resize", updateDefaultVideoTrim);
    };
  }, [updateDefaultVideoTrim]);

  return [trimmer, trimmerDispatch];
}

export default useTrimmerOnWindowResize;
