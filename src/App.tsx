import Ruler from "@components/Ruler";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div id="app">
      <VideoPlayer />

      <div className="video-trimmer-ruler-container">
        <Ruler />

        <div className="divider" />

        <Trimmer />
      </div>
    </div>
  );
}

export default App;
