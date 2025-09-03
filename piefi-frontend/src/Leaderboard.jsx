import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to load leaderboard');
      }
      const data = await response.json();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard. Make sure your backend is running on localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getRankEmoji = (rank) => {
    switch(rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold">🏆 Current Rankings</h2>
        </div>
        <div className="text-center p-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold">🏆 Current Rankings</h2>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 p-5 m-5 rounded-xl text-center">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold">🏆 Current Rankings</h2>
        </div>
        <div className="text-center p-16 text-gray-600">
          <div className="text-6xl mb-5 opacity-50">📈</div>
          <h3 className="text-xl font-semibold mb-2">No projects yet!</h3>
          <p>Upload a video to get started</p>
        </div>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
        <h2 className="text-2xl font-bold">🏆 Current Rankings</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedTasks.map((task) => (
          <div 
            key={task.id} 
            className="flex items-center p-6 hover:bg-indigo-50/50 transition-all duration-300 hover:translate-x-1 relative group"
          >
            {task.rank === 1 && (
              <div className="absolute top-2 right-5 text-2xl opacity-70">👑</div>
            )}
            
            <div className={`text-3xl font-black w-20 text-center mr-5 ${getRankClass(task.rank)}`}>
              #{task.rank}
            </div>
            
            <div className="flex-1 mr-5">
              <div className="text-lg font-semibold mb-2 leading-snug">
                {task.description}
              </div>
              <div className="flex gap-5 text-sm text-gray-600">
                <span>⏱️ {task.time_taken} day{task.time_taken !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-indigo-100/50 rounded-xl min-w-20">
              <div className="text-2xl">{getRankEmoji(task.rank)}</div>
              <div className="text-xs text-gray-600 font-semibold uppercase mt-1">Rank</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;