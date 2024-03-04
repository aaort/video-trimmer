import { IVideo } from ".";

interface TrimVideoAction {
  type: "trim";
  payload: { start: number; end: number };
}

interface UpdateURLVideoAction {
  type: "update-url";
  payload: string;
}
interface SetDurationVideoAction {
  payload: number;
  type: "set-duration";
}

type VideoAction =
  | TrimVideoAction
  | UpdateURLVideoAction
  | SetDurationVideoAction;

function videoReducer(video: IVideo, action: VideoAction): IVideo {
  switch (action.type) {
    case "trim": {
      const { start, end } = action.payload;

      return { ...video, trimStart: start, trimEnd: end };
    }

    case "update-url": {
      return {
        ...video,
        videoUrl: action.payload,
      };
    }

    case "set-duration": {
      return {
        ...video,
        trimEnd: action.payload,
        videoDuration: action.payload,
      };
    }
  }
}

export type { VideoAction };
export { videoReducer };
