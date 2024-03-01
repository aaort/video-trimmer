function getTimeFromSeconds(seconds: number) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    throw new Error("Input must be a number");
  }
  seconds = Math.max(0, seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export { getTimeFromSeconds };
