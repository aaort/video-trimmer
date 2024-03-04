import Ruler from "@components/Ruler";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer";
import VideoURLUpdater from "@components/VideoURLUpdater";
import "./App.css";

function App() {
  return (
    <>
      <VideoURLUpdater />

      <div className="app">
        <VideoPlayer />

        <div className="video-trimmer-ruler-container">
          <Ruler />
          <div className="divider" />
          <Trimmer />
        </div>
      </div>
    </>
  );
}

export default App;
