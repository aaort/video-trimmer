import useVideo from "@store/hook";
import "@styles/ruler.css";
import { getVideoDurationSteps } from "@utils/getVideoDurationStep";

function Ruler() {
  const [video] = useVideo();

  const { videoDuration } = video;

  const steps = getVideoDurationSteps(videoDuration);

  const filteredSteps = steps.map((step) => {
    return `${step}s`;
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
