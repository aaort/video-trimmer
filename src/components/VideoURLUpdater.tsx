import useVideo from "@hooks/useVideo";
import { IVideo } from "@store/index";
import "@styles/video-url-updater.css";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { createPortal } from "react-dom";
import Edit from "./icons/Edit";

interface FormData extends Pick<IVideo, "videoUrl" | "videoDuration"> {}

function VideoURLUpdater() {
  const [, dispatch] = useVideo();
  const [formData, setFormData] = useState<FormData>({
    videoUrl: "",
    videoDuration: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleUrlChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setFormData({ ...formData, videoUrl: event.target.value });

  const handleDurationChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, videoDuration: Number(event.target.value) });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsDialogOpen(false);
    dispatch({ type: "update-url", payload: formData });
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
              onChange={handleUrlChange}
              placeholder="Video URL"
            />

            <input
              type="number"
              onChange={handleDurationChange}
              placeholder="Video duration in seconds"
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
