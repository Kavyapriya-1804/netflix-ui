import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import videojs from "video.js";
import Hls from "hls.js";
import "video.js/dist/video-js.css";
import { MdArrowBack } from "react-icons/md";
import "./watch.scss";
import toast from "react-hot-toast";

export default function Watch({src}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  // Use dynamic video ID from URL params if available, otherwise use the prop src
  const videoSrc = videoId ? 
    `http://localhost:8080/api/v1/videos/${videoId}/master.m3u8` : 
    src;

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    //for init

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: "auto",
      download: true,
    });

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = videoSrc;
      videoRef.current.addEventListener("canplay", () => {
        videoRef.current.play();
      });
    } else {
      console.log("video format not supportted");
      toast.error("Video format not supporteds");
    }
  }, [videoSrc]);

  return (
    <div className="watch">
      <div className="back" onClick={handleBack} style={{cursor: 'pointer'}}>
        <MdArrowBack />
        Home
      </div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-control-bar video"
        ></video>
      </div>
      {/* <video
        className="video"
        autoPlay
        progress
        controls
        src="https://vod-progressive.akamaized.net/exp=1624452918~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2400%2F14%2F362003850%2F1486625955.mp4~hmac=d6f829e7bb83f1ee6a28047d00aa2c1083c8fe5036c8084a4adf1c3903085856/vimeo-prod-skyfire-std-us/01/2400/14/362003850/1486625955.mp4"
      /> */}
    </div>
  );
}
