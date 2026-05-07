import React, { useRef, useState, useEffect } from 'react';
import CameraFeed from './CameraFeed';
import '../styles/components.css';

const FaceCapture = ({ onFaceCaptured, onValidationUpdate }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState('manual'); // 'manual' or 'auto'
  const [cameraActive, setCameraActive] = useState(false);
  const [validationStats, setValidationStats] = useState({
    facesDetected: 0,
    lastCapture: null,
    totalCaptures: 0
  });

  const cameraFeedRef = useRef();

  const startCamera = async () => {
    if (cameraFeedRef.current) {
      await cameraFeedRef.current.startCamera();
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (cameraFeedRef.current) {
      cameraFeedRef.current.stopCamera();
      setCameraActive(false);
    }
  };

  const captureFace = () => {
    if (cameraFeedRef.current) {
      cameraFeedRef.current.captureFace();
    }
  };

  const handleValidationUpdate = (validation) => {
    onValidationUpdate(validation);
    setValidationStats(prev => ({
      ...prev,
      facesDetected: validation?.facesDetected || 0
    }));
  };

  const handleFaceCaptured = (faceData) => {
    onFaceCaptured(faceData);
    setValidationStats(prev => ({
      ...prev,
      lastCapture: new Date().toLocaleTimeString(),
      totalCaptures: prev.totalCaptures + 1
    }));
  };

  return (
    <div className="face-capture-container">
      <div className="capture-controls">
        <h2>Face Capture</h2>
        
        <div className="control-buttons">
          <button 
            onClick={cameraActive ? stopCamera : startCamera}
            className={`btn ${cameraActive ? 'btn-stop' : 'btn-start'}`}
          >
            {cameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
          
          <button 
            onClick={captureFace}
            disabled={!cameraActive}
            className="btn btn-capture"
          >
            Capture Face
          </button>
        </div>

        <div className="capture-settings">
          <label>
            Capture Mode:
            <select 
              value={captureMode}
              onChange={(e) => setCaptureMode(e.target.value)}
            >
              <option value="manual">Manual</option>
              <option value="auto">Auto (Every 5s)</option>
            </select>
          </label>
        </div>

        <div className="validation-stats">
          <div className="stat-item">
            <span className="stat-label">Faces Detected:</span>
            <span className="stat-value">{validationStats.facesDetected}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Captures:</span>
            <span className="stat-value">{validationStats.totalCaptures}</span>
          </div>
          {validationStats.lastCapture && (
            <div className="stat-item">
              <span className="stat-label">Last Capture:</span>
              <span className="stat-value">{validationStats.lastCapture}</span>
            </div>
          )}
        </div>
      </div>

      <div className="camera-feed-container">
        <CameraFeed
          ref={cameraFeedRef}
          onFaceCaptured={handleFaceCaptured}
          onValidationUpdate={handleValidationUpdate}
          autoCapture={captureMode === 'auto'}
        />
      </div>
    </div>
  );
};

export default FaceCapture;