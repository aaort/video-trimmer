import "@styles/trimmer-handler.css";
import { ForwardedRef, forwardRef } from "react";

interface HandlerProps {
  forSide: "start" | "end";
  left: React.CSSProperties["left"];
  onMouseDown: React.ComponentProps<"div">["onMouseDown"];
}

const TRIMMER_HANDLER_WIDTH = 20;

const ids: Record<HandlerProps["forSide"], string> = {
  start: "trimmer-start-handler",
  end: "trimmer-end-handler",
};

const TrimmerHandler = forwardRef(
  (props: HandlerProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { forSide, left, onMouseDown } = props;

    return (
      <div
        ref={ref}
        id={ids[forSide]}
        onMouseDown={onMouseDown}
        className="trimmer-handler"
        style={{ left, width: TRIMMER_HANDLER_WIDTH }}
      />
    );
  }
);

export { TRIMMER_HANDLER_WIDTH };
export default TrimmerHandler;
