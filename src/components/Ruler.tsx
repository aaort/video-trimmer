import useVideo from "@hooks/useVideo";
import "@styles/ruler.css";

function Ruler() {
  const { video } = useVideo();

  const { videoDuration } = video;

  const isSeconds = videoDuration < 180;
  const isHours = videoDuration > 3600;

  const steps = divideVideoDuration(videoDuration);

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

function divideVideoDuration(durationInSeconds: number) {
  const numSteps = 6;
  const stepDuration = durationInSeconds / numSteps;
  const steps = [];

  for (let i = 0; i < numSteps; i++) {
    const stepValue = Math.round(stepDuration * i);
    steps.push(stepValue);
  }

  steps.push(Math.round(durationInSeconds)); // Last step is the rounded total duration
  return steps;
}

export default Ruler;
