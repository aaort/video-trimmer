import Ruler from "@components/Ruler";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div className="app">
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
