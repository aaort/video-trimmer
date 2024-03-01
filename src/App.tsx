import Ruler from "@components/Ruler";
import Trimmer from "@components/Trimmer";
import VideoPlayer from "@components/VideoPlayer";
import "./App.css";

function App() {
  return (
    <div id="app">
      <VideoPlayer />

      <Ruler />

      <Trimmer />
    </div>
  );
}

export default App;
