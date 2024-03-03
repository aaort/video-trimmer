import { IVideo, VideoContext, VideoContextType } from "@store/index";
import { VideoAction } from "@store/videoReducer";
import { useContext } from "react";

function useVideo(): [IVideo, React.Dispatch<VideoAction>] {
  const { video, dispatch } = useContext<VideoContextType>(VideoContext);

  return [video, dispatch];
}

export default useVideo;
