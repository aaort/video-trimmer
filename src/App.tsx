import Ruler from "@components/Ruler/index";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer/index";
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
