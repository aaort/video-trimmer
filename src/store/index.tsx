import { PropsWithChildren, createContext, useReducer } from "react";
import { VideoAction, videoReducer } from "./videoReducer";

interface IVideo {
  trimEnd: number;
  videoUrl: string;
  trimStart: number;
  videoDuration: number;
}

const initialVideo: IVideo = {
  trimEnd: 15,
  trimStart: 0,
  videoDuration: 15,
  videoUrl:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
};

interface VideoContextType {
  video: IVideo;
  dispatch: React.Dispatch<VideoAction>;
}

const VideoContext = createContext<VideoContextType>({
  dispatch: () => {},
  video: initialVideo,
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
export type { IVideo, VideoContextType };
export default VideoProvider;
