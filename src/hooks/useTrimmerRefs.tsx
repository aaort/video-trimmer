import { useRef } from "react";

function useTrimmerRefs() {
  const trimmerPortion = useRef<HTMLDivElement>(null);
  const trimmerContainer = useRef<HTMLDivElement>(null);
  const trimmerEndHandler = useRef<HTMLDivElement>(null);
  const trimmerStartHandler = useRef<HTMLDivElement>(null);

  return {
    trimmerPortion,
    trimmerContainer,
    trimmerEndHandler,
    trimmerStartHandler,
  };
}

export default useTrimmerRefs;
