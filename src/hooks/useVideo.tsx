import { VideoContext, VideoContextType } from "@store/index";
import { useContext } from "react";

function useVideo() {
  const { video, dispatch } = useContext<VideoContextType>(VideoContext);

  return { video, dispatch };
}

export default useVideo;
