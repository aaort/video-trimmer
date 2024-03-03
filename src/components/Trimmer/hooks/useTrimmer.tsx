import { useReducer } from "react";

interface TrimmerState {
  startHandler: {
    x: number;
    initialX: number;
    isDragging: boolean;
  };
  trimmerPortion: {
    isDragging: boolean;
  };
  endHandler: {
    x: number;
    initialX: number;
    isDragging: boolean;
  };
}

const defaultTrimmerState: TrimmerState = {
  startHandler: {
    x: 0,
    initialX: 0,
    isDragging: false,
  },
  trimmerPortion: {
    isDragging: false,
  },
  endHandler: {
    x: 0,
    initialX: 0,
    isDragging: false,
  },
};

interface DragAction {
  type: "drag";
  payload: {
    endDragging: boolean;
    startDragging: boolean;
    trimmerPortionDragging: boolean;
  };
}

interface TrimAction {
  type: "trim";
  payload: {
    end: Partial<TrimmerState["endHandler"]>;
    start: Partial<TrimmerState["startHandler"]>;
  };
}

interface StopAction {
  type: "stop";
  payload?: undefined;
}

type TrimmerAction = DragAction | TrimAction | StopAction;

function trimmerReducer(
  state: TrimmerState,
  action: TrimmerAction
): TrimmerState {
  switch (action.type) {
    case "stop": {
      return {
        trimmerPortion: { isDragging: false },
        endHandler: { ...state.endHandler, isDragging: false },
        startHandler: { ...state.startHandler, isDragging: false },
      };
    }

    case "trim": {
      const payload = action.payload;

      return {
        ...state,
        startHandler: { ...state.startHandler, ...payload.start },
        endHandler: { ...state.endHandler, ...payload.end },
      };
    }

    case "drag": {
      const payload = action.payload;

      return {
        startHandler: {
          ...state.startHandler,
          isDragging: payload.startDragging,
        },
        endHandler: {
          ...state.endHandler,
          isDragging: payload.endDragging,
        },
        trimmerPortion: {
          isDragging: payload.trimmerPortionDragging,
        },
      };
    }

    default:
      return state;
  }
}

function useTrimmer() {
  return useReducer(trimmerReducer, defaultTrimmerState);
}

export type { TrimmerState, TrimmerAction };
export default useTrimmer;
