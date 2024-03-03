import { IVideo } from ".";

interface TrimVideoAction {
  type: "trim";
  payload: { start: number; end: number };
}

interface UpdateUrlVideoAction {
  type: "update-url";
  payload: { videoUrl: string; videoDuration: number };
}

type VideoAction = TrimVideoAction | UpdateUrlVideoAction;

function videoReducer(video: IVideo, action: VideoAction): IVideo {
  switch (action.type) {
    case "trim": {
      const { start, end } = action.payload;

      return { ...video, trimStart: start, trimEnd: end };
    }

    case "update-url": {
      return { ...video, ...action.payload };
    }
  }
}

export type { VideoAction };
export { videoReducer };
