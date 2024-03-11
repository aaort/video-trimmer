import "@styles/trimmer-handler.css";
import { ComponentProps, ForwardedRef, forwardRef } from "react";

interface HandlerProps extends ComponentProps<"div"> {
  forSide: "start" | "end";
}

const TRIMMER_HANDLER_WIDTH = 20;

const ids: Record<HandlerProps["forSide"], string> = {
  end: "trimmer-end-handler",
  start: "trimmer-start-handler",
};

const TrimmerHandler = forwardRef(
  (props: HandlerProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { forSide, ...rest } = props;

    return (
      <div
        ref={ref}
        id={ids[forSide]}
        className="trimmer-handler"
        style={{ width: TRIMMER_HANDLER_WIDTH }}
        {...rest}
      />
    );
  }
);

export default TrimmerHandler;
