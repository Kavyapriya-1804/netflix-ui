import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const [hlsInstance, setHlsInstance] = useState(null);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 for auto
  const [isAutoMode, setIsAutoMode] = useState(true); // Track if we're in auto mode
  const isAutoModeRef = useRef(true); // Ref to track auto mode for event listeners

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        // Optimized for seamless quality switching
        maxBufferLength: 30, // Longer buffer for seamless switching
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        enableWorker: true,
        // Enable seamless quality switching
        startLevel: -1, // Auto quality selection
        capLevelToPlayerSize: false, // Don't limit quality based on player size
        // Optimized loading settings
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 10000,
      });
      
      hls.loadSource(`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setQualityLevels(data.levels);
        hls.currentLevel = -1; // Start with auto quality
        setCurrentQuality(-1);
        setIsAutoMode(true);
        isAutoModeRef.current = true;
      });

      // Track when level switching completes
      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        console.log('Level switched to:', data.level);
        // Only update currentQuality if we're not in auto mode
        // In auto mode, HLS.js manages the level but UI should show "Auto"
        if (!isAutoModeRef.current) {
          setCurrentQuality(data.level);
        }
      });

      setHlsInstance(hls);

      return () => {
        hls.destroy();
      };
    } else {
      console.error('HLS.js is not supported in this browser.');
    }
  }, [videoId]);

  const handleQualityChange = useCallback((levelIndex) => {
    if (hlsInstance && videoRef.current) {
      console.log('Changing quality to level:', levelIndex);
      
      // Simply change the quality level - HLS.js handles seamless switching
      hlsInstance.currentLevel = levelIndex;
      
      // Update the UI state
      if (levelIndex === -1) {
        // Auto mode
        setIsAutoMode(true);
        isAutoModeRef.current = true;
        setCurrentQuality(-1);
      } else {
        // Manual quality selection
        setIsAutoMode(false);
        isAutoModeRef.current = false;
        setCurrentQuality(levelIndex);
      }
    }
  }, [hlsInstance]);



  return (
    <div>
      <video ref={videoRef} controls width="100%" />
      <div style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Quality:</span>
        <button 
          onClick={() => handleQualityChange(-1)}
          style={{ 
            marginRight: '5px',
            backgroundColor: isAutoMode ? '#e50914' : '#333',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Auto
        </button>
        {qualityLevels.map((level, index) => (
          <button 
            key={index} 
            onClick={() => handleQualityChange(index)}
            style={{ 
              marginRight: '5px',
              backgroundColor: !isAutoMode && currentQuality === index ? '#e50914' : '#333',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {level.height}p
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
