import useVideo from "@hooks/useVideo";
import { IVideo } from "@store/index";
import "@styles/video-url-updater.css";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

interface FormData extends Pick<IVideo, "videoUrl" | "videoDuration"> {}

function VideoUrlUpdater() {
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
      <button onClick={openDialog}> Update Video Url </button>

      <dialog className="video-url-dialog" open={isDialogOpen}>
        <form className="video-url-form" onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={handleUrlChange}
            placeholder="Enter link to a video file"
          />

          <input
            type="number"
            onChange={handleDurationChange}
            placeholder="Enter video duration in seconds"
          />

          <div className="video-url-form-button-container">
            <button type="button" onClick={closeDialog}>
              Close
            </button>

            <button type="submit"> Set</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default VideoUrlUpdater;