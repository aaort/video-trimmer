import { PropsWithChildren, createContext, useReducer } from "react";
import { VideoAction, videoReducer } from "./reducers";

interface Video {
  trimEnd: number;
  videoUrl: string;
  trimStart: number;
  videoDuration: number;
}

const initialVideo: Video = {
  trimEnd: 15,
  trimStart: 0,
  videoDuration: 15,
  videoUrl:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
};

interface VideoContextType {
  video: Video;
  dispatch: React.Dispatch<VideoAction>;
}

const VideoContext = createContext<VideoContextType>({
  video: initialVideo,
  dispatch: () => {},
});

interface VideoProviderProps extends PropsWithChildren {}

function VideoProvider(props: VideoProviderProps) {
  const { children } = props;
  const [video, dispatch] = useReducer(videoReducer, initialVideo);

  return (
    <VideoContext.Provider value={{ video, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
}

export { VideoContext };
export type { Video, VideoContextType };
export default VideoProvider;
