import { Video } from ".";

interface VideoAction {
  type: "trim";
  payload: { start: number; end: number };
}

function videoReducer(video: Video, action: VideoAction): Video {
  if (action.type === "trim") {
    const { start, end } = action.payload;

    return { ...video, trimStart: start, trimEnd: end };
  }

  return video;
}

export type { VideoAction };
export { videoReducer };
