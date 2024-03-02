function getTimeFromSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  let remainingSeconds = (seconds % 60).toFixed(1);

  if (String(remainingSeconds).split(".")[1] !== "0") {
    remainingSeconds = String(remainingSeconds).padStart(4, "0");
  } else {
    remainingSeconds = Number(remainingSeconds).toFixed(0);
  }

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export { getTimeFromSeconds };
