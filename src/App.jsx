import "./app.scss"
import VideoUpload from "./components/videoupload/VideoUpload";
// import Home from "./pages/home/Home";
// import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
// import Login from "./pages/login/Login";

const App = () => {
  var videoId = "5fb04519-1332-472e-ba42-51a20ea77dfb";
  
  return <Watch src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`} />;
  // return <Home />;
  // return <div className="w-full"><VideoUpload/> </div>
};

export default App;