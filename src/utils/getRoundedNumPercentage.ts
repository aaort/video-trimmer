function getRoundedTimePercentage(num: number, baseNum: number) {
  if (baseNum === 0) {
    throw new Error("Cannot calculate percentage: Division by zero");
  }

  return Math.round((num / baseNum) * 100);
}

export { getRoundedTimePercentage };
