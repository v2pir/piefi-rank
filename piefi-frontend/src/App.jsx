import React, { useState } from 'react';
import VideoUpload from './VideoUpload';
import Leaderboard from './Leaderboard';

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (result) => {
    console.log('Video processed successfully:', result);
    // Trigger leaderboard refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="text-center mb-10 text-white">
          <h1 className="text-5xl font-black mb-3 drop-shadow-lg">
            🚀 Project Speed Leaderboard
          </h1>
          <p className="text-xl opacity-90">
            Real-time rankings of project completion velocity
          </p>
        </div>

        {/* Video Upload Section */}
        <VideoUpload onUploadSuccess={handleUploadSuccess} />

        {/* Leaderboard Section */}
        <Leaderboard key={refreshTrigger} />
      </div>
    </div>
  );
};

export default App;