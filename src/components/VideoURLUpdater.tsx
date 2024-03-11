import Edit from "@icons/Edit";
import useVideo from "@store/hook";
import "@styles/video-url-updater.css";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

function VideoURLUpdater() {
  const [video, dispatch] = useVideo();
  const videoUrlInput = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>(video.videoUrl);

  useEffect(() => {
    if (isDialogOpen) videoUrlInput.current?.select();
  }, [isDialogOpen]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setVideoUrl(event.target.value);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsDialogOpen(false);
    dispatch({ type: "update-url", payload: videoUrl });
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
              value={videoUrl}
              ref={videoUrlInput}
              placeholder="Video URL"
              onChange={handleUrlChange}
            />

            <div className="video-url-form-button-container">
              <button type="button" onClick={closeDialog}>
                Close
              </button>

              <button type="submit">Set</button>
            </div>
          </form>
        </dialog>,
        document.body
      )}
    </>
  );
}

export default VideoURLUpdater;
