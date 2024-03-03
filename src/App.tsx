import Ruler from "@components/Ruler";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer";
import "./App.css";
import VideoUrlUpdater from "@components/VideoUrlUpdater";

function App() {
  return (
    <div className="app">
      <VideoPlayer />

      <VideoUrlUpdater />

      <div className="video-trimmer-ruler-container">
        <Ruler />
        <div className="divider" />
        <Trimmer />
      </div>
    </div>
  );
}

export default App;
