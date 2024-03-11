import useVideo from "@store/hook";
import "@styles/trimmer.css";
import { useEffect } from "react";
import { handleMouseDown, handleMouseMove, handleMouseUp } from "./listeners";

function Trimmer() {
  const [video, videoDispatch] = useVideo();

  useEffect(() => {
    const handleVideoUpdateOnMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, videoDispatch);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleVideoUpdateOnMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleVideoUpdateOnMouseMove);
    };
  }, [video, videoDispatch]);

  return (
    <div id="trimmer-container">
      <div id="trimmer-start-handler" className="trimmer-handler" />

      <div id="trimmer-portion" />

      <div id="trimmer-end-handler" className="trimmer-handler" />
    </div>
  );
}

export default Trimmer;
