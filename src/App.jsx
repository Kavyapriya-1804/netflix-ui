import "./app.scss";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VideoUpload from "./components/videoupload/VideoUpload";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
import Login from "./pages/login/Login";

const App = () => {
  const videoId = "5fb04519-1332-472e-ba42-51a20ea77dfb";
  
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Watch video route with dynamic ID */}
          <Route 
            path="/watch/:videoId?" 
            element={<Watch src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`} />} 
          />
          
          {/* Video upload route */}
          <Route path="/upload" element={
            <div className="w-full">
              <VideoUpload />
            </div>
          } />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;