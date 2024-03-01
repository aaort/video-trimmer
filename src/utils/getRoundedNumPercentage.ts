function getRoundedTimePercentage(num: number, baseNum: number) {
  return Math.round((num / baseNum) * 100);
}

export { getRoundedTimePercentage };
