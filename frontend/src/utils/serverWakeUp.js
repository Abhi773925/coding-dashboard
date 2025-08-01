// Server wake-up utility to prevent 503 errors
const wakeUpServer = async () => {
  try {
    const response = await fetch('https://prepmate-kvol.onrender.com/api/internal/ping');
    if (response.ok) {
      console.log('✅ Backend server is awake');
      return true;
    }
  } catch (error) {
    console.log('⏰ Waking up backend server...');
    // Try again after a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const retryResponse = await fetch('https://prepmate-kvol.onrender.com/api/internal/ping');
      return retryResponse.ok;
    } catch (retryError) {
      console.error('❌ Failed to wake up server:', retryError);
      return false;
    }
  }
};

// Enhanced fetch with server wake-up
export const fetchWithWakeUp = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 503) {
      console.log('🔄 Server sleeping, attempting to wake up...');
      const isAwake = await wakeUpServer();
      if (isAwake) {
        // Retry the original request
        return await fetch(url, options);
      }
    }
    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};

export default wakeUpServer;
