import { Video, VideoContext, VideoContextType } from "@store/index";
import { VideoAction } from "@store/reducers";
import { useContext } from "react";

function useVideo(): [Video, React.Dispatch<VideoAction>] {
  const { video, dispatch } = useContext<VideoContextType>(VideoContext);

  return [video, dispatch];
}

export default useVideo;
