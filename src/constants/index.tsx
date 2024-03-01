interface CurrentDraggedItem {
  trimEnd: boolean;
  trimStart: boolean;
  trimmerPortion: boolean;
}

const currentDraggedItemDefaultValues: CurrentDraggedItem = {
  trimEnd: false,
  trimStart: false,
  trimmerPortion: false,
};

const offsetsDefaultValues = {
  trimEnd: 0,
  trimStart: 0,
};

const initialPositionsXDefaultValues = {
  endHandler: 0,
  startHandler: 0,
};

export {
  currentDraggedItemDefaultValues,
  offsetsDefaultValues,
  initialPositionsXDefaultValues,
};
