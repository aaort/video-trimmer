function getVideoDurationSteps(durationInSeconds: number) {
  const numSteps = 6;
  const stepDuration = durationInSeconds / numSteps;
  const steps = [];

  for (let i = 0; i < numSteps; i++) {
    const stepValue = Math.round(stepDuration * i);
    steps.push(stepValue);
  }

  steps.push(Math.round(durationInSeconds));
  return steps;
}

export { getVideoDurationSteps };
