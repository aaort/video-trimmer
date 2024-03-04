import useVideo from "@hooks/useVideo";
import { IVideo } from "@store/index";
import "@styles/video-url-updater.css";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Edit from "./icons/Edit";

interface FormData extends Pick<IVideo, "videoUrl"> {}

function VideoURLUpdater() {
  const [video, dispatch] = useVideo();
  const [formData, setFormData] = useState<FormData>({
    videoUrl: video.videoUrl,
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const videoUrlInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDialogOpen) videoUrlInput.current?.select();
  }, [isDialogOpen]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setFormData({ ...formData, videoUrl: event.target.value });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsDialogOpen(false);
    dispatch({ type: "update-url", payload: formData.videoUrl });
  };

  return (
    <>
      <div className="video-url-updater">
        <button className="icon-button" onClick={openDialog}>
          <Edit />
        </button>
      </div>

      {createPortal(
        <dialog className="video-url-dialog" open={isDialogOpen}>
          <form className="video-url-form" onSubmit={handleSubmit}>
            <input
              type="text"
              ref={videoUrlInput}
              placeholder="Video URL"
              value={formData.videoUrl}
              onChange={handleUrlChange}
            />

            <div className="video-url-form-button-container">
              <button type="button" onClick={closeDialog}>
                Close
              </button>

              <button type="submit"> Set</button>
            </div>
          </form>
        </dialog>,
        document.body
      )}
    </>
  );
}

export default VideoURLUpdater;
