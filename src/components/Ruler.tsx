import useVideo from "@hooks/useVideo";
import "@styles/ruler.css";
import { getVideoDurationSteps } from "@utils/getVideoDurationStep";

function Ruler() {
  const [video] = useVideo();

  const { videoDuration } = video;

  const isSeconds = videoDuration < 180;
  const isHours = videoDuration > 3600;

  const steps = getVideoDurationSteps(videoDuration);

  const filteredSteps = steps.map((step) => {
    return `${step}${isSeconds ? "s" : isHours ? "h" : "m"}`;
  });

  return (
    <div id="ruler-container">
      {filteredSteps.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}

export default Ruler;
