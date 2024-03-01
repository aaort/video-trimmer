import "@styles/trimmer-handler.css";
import { ComponentProps, ForwardedRef, forwardRef } from "react";

interface HandlerProps extends ComponentProps<"div"> {
  forSide: "start" | "end";
  left: React.CSSProperties["left"];
  onMouseDown: React.ComponentProps<"div">["onMouseDown"];
}

const TRIMMER_HANDLER_WIDTH = 20;

const ids: Record<HandlerProps["forSide"], string> = {
  end: "trimmer-end-handler",
  start: "trimmer-start-handler",
};

const TrimmerHandler = forwardRef(
  (props: HandlerProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { forSide, left, onMouseDown, ...rest } = props;

    return (
      <div
        ref={ref}
        id={ids[forSide]}
        onMouseDown={onMouseDown}
        className="trimmer-handler"
        style={{ left, width: TRIMMER_HANDLER_WIDTH }}
        {...rest}
      />
    );
  }
);

export { TRIMMER_HANDLER_WIDTH };
export default TrimmerHandler;
