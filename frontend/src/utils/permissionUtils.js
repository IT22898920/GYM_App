// Permission utility functions for WebRTC

export const checkMediaPermissions = async () => {
  try {
    // Check if Permissions API is supported
    if (!navigator.permissions) {
      return { camera: 'unavailable', microphone: 'unavailable' };
    }

    const [cameraPermission, microphonePermission] = await Promise.all([
      navigator.permissions.query({ name: 'camera' }),
      navigator.permissions.query({ name: 'microphone' })
    ]);

    return {
      camera: cameraPermission.state,
      microphone: microphonePermission.state
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { camera: 'unknown', microphone: 'unknown' };
  }
};

export const requestMediaPermissions = async (needVideo = false) => {
  try {
    const constraints = {
      audio: true,
      video: needVideo
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Stop the stream immediately - we just wanted to request permissions
    stream.getTracks().forEach(track => track.stop());
    
    return { success: true, error: null };
  } catch (error) {
    let errorMessage = 'Failed to get permissions';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage = 'Permission denied. Please allow camera/microphone access.';
        break;
      case 'NotFoundError':
        errorMessage = 'No camera/microphone found.';
        break;
      case 'NotReadableError':
        errorMessage = 'Camera/microphone is already in use.';
        break;
      case 'OverconstrainedError':
        errorMessage = 'Camera/microphone constraints not supported.';
        break;
      default:
        errorMessage = `Permission error: ${error.message}`;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const getAvailableDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    return {
      cameras: devices.filter(device => device.kind === 'videoinput'),
      microphones: devices.filter(device => device.kind === 'audioinput'),
      speakers: devices.filter(device => device.kind === 'audiooutput')
    };
  } catch (error) {
    console.error('Error enumerating devices:', error);
    return { cameras: [], microphones: [], speakers: [] };
  }
};

export const createPermissionRequestButton = (onRequest, needVideo = false) => {
  return {
    text: needVideo ? 'Allow Camera & Microphone' : 'Allow Microphone',
    onClick: () => onRequest(needVideo),
    className: 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
  };
};