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

      if (typeof payload === "undefined") return state;

      let newState = state;
      if (typeof payload.start === "object") {
        newState = {
          ...newState,
          startHandler: { ...newState.startHandler, ...payload.start },
        };
      }

      if (typeof payload.end === "object") {
        newState = {
          ...newState,
          endHandler: { ...newState.endHandler, ...payload.end },
        };
      }

      return newState;
    }

    case "drag": {
      const payload = action.payload;

      if (typeof payload === "undefined") return state;

      let newState = state;

      if (typeof payload.startDragging === "boolean") {
        newState = {
          ...newState,
          startHandler: {
            ...newState.startHandler,
            isDragging: payload.startDragging,
          },
        };
      }

      if (typeof payload.endDragging === "boolean") {
        newState = {
          ...newState,
          endHandler: {
            ...newState.endHandler,
            isDragging: payload.endDragging,
          },
        };
      }

      newState = {
        ...newState,
        trimmerPortion: {
          isDragging: (payload as DragAction["payload"]).trimmerPortionDragging,
        },
      };

      return newState;
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
