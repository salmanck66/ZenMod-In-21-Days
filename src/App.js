import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Trophy, Target, Sparkles, Star } from 'lucide-react';

const defaultActivities = [
  { id: 1, name: 'Wake Up', startTime: '06:00', endTime: '06:30', icon: '🌅' },
  { id: 2, name: 'Prayer', startTime: '06:30', endTime: '07:00', icon: '🙏' },
  { id: 3, name: 'Workout', startTime: '07:00', endTime: '08:00', icon: '💪' },
  { id: 4, name: 'Read Book', startTime: '20:00', endTime: '21:00', icon: '📚' },
  { id: 5, name: 'Sleep', startTime: '22:00', endTime: '22:30', icon: '😴' },
];

const LifeSuccessJourney = () => {

  const motivationalQuotes = [
    "Every journey begins with a single step!",
    "You're building better habits, one day at a time!",
    "Consistency is the key to transformation!",
    "Small progress is still progress!",
    "You're stronger than you think!",
    "Today's effort is tomorrow's success!",
    "Keep pushing, you're doing amazing!",
    "Your future self will thank you!",
    "Discipline today, freedom tomorrow!",
    "You're closer to your goals than yesterday!",
    "Believe in the process!",
    "Every day is a new opportunity!",
    "Your dedication is inspiring!",
    "Stay focused, stay committed!",
    "You're on the path to greatness!",
    "Progress over perfection!",
    "Your consistency is your superpower!",
    "One day at a time, one habit at a time!",
    "You're building the life you deserve!",
    "The best investment is in yourself!",
    "You've got this, champion!"
  ];

  const getLevelInfo = (completedDays) => {
    if (completedDays >= 30) return { name: 'Zen Master', icon: '🧘', color: 'from-purple-500 to-pink-500', days: 30 };
    if (completedDays >= 21) return { name: 'Master', icon: '👑', color: 'from-yellow-400 to-orange-500', days: 21 };
    if (completedDays >= 14) return { name: 'Intermediate', icon: '⚡', color: 'from-blue-400 to-cyan-500', days: 14 };
    if (completedDays >= 7) return { name: 'Warrior', icon: '⚔️', color: 'from-green-400 to-emerald-500', days: 7 };
    return { name: 'Beginner', icon: '🌱', color: 'from-gray-400 to-gray-500', days: 0 };
  };

  const [activities, setActivities] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  const [cycleData, setCycleData] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', startTime: '', endTime: '', icon: '✨' });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lifeSuccessJourney');
    if (saved) {
      const data = JSON.parse(saved);
      setActivities(data.activities || defaultActivities);
      setCycleData(data.cycleData || []);
      setCurrentDay(data.currentDay || 1);
      setCompletedToday(data.completedToday || []);
    } else {
      setActivities(defaultActivities);
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    } else if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lifeSuccessJourney', JSON.stringify({
      activities,
      cycleData,
      currentDay,
      completedToday,
      lastSaved: new Date().toISOString()
    }));
  }, [activities, cycleData, currentDay, completedToday]);

  // Check for notifications
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      activities.forEach(activity => {
        // Start notification
        if (activity.startTime === currentTime && !completedToday.includes(activity.id)) {
          new Notification('Time to start!', {
            body: `${activity.icon} ${activity.name} - Let's do this!`,
            icon: '🎯'
          });
        }

        // End notification
        if (activity.endTime === currentTime && !completedToday.includes(activity.id)) {
          new Notification('Activity ending soon!', {
            body: `${activity.icon} ${activity.name} - Have you finished?`,
            icon: '⏰'
          });
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [activities, completedToday, notificationsEnabled]);

  const calculatePercentage = () => {
    if (activities.length === 0) return 0;
    return Math.round((completedToday.length / activities.length) * 100);
  };

  const toggleActivity = (activityId) => {
    setCompletedToday(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const addActivity = () => {
    if (newActivity.name && newActivity.startTime && newActivity.endTime) {
      const activity = {
        id: Date.now(),
        ...newActivity
      };
      setActivities([...activities, activity]);
      setNewActivity({ name: '', startTime: '', endTime: '', icon: '✨' });
      setShowAddForm(false);
    }
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
    setCompletedToday(completedToday.filter(actId => actId !== id));
  };

  const completeDay = () => {
    const percentage = calculatePercentage();
    const newCycleData = [...cycleData, { day: currentDay, percentage, date: new Date().toISOString() }];
    setCycleData(newCycleData);
    
    if (currentDay >= 21) {
      // Cycle complete - show celebration and reset
      alert(`🎉 Congratulations! You've completed your 21-day journey with an average of ${Math.round(newCycleData.reduce((sum, d) => sum + d.percentage, 0) / newCycleData.length)}%!`);
      setCycleData([]);
      setCurrentDay(1);
    } else {
      setCurrentDay(currentDay + 1);
    }
    setCompletedToday([]);
  };

  const resetCycle = () => {
    if (window.confirm('Are you sure you want to reset your cycle?')) {
      setCycleData([]);
      setCurrentDay(1);
      setCompletedToday([]);
    }
  };

  const level = getLevelInfo(cycleData.length);
  const todayPercentage = calculatePercentage();
  const todayQuote = motivationalQuotes[currentDay % motivationalQuotes.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 pb-20">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Life Success Journey
            </h1>
          </div>
          <p className="text-purple-200 text-sm">Transform your life, one habit at a time</p>
        </div>

        {/* Level Badge */}
        <div className={`bg-gradient-to-r ${level.color} rounded-2xl p-6 mb-6 shadow-2xl`}>
          <div className="text-center">
            <div className="text-5xl mb-2">{level.icon}</div>
            <h2 className="text-2xl font-bold mb-1">{level.name}</h2>
            <p className="text-sm opacity-90">Day {currentDay} of 21</p>
            <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(currentDay / 21) * 100}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-75">{currentDay} / 21 days completed</p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Progress
            </h3>
            <span className="text-3xl font-bold text-yellow-300">{todayPercentage}%</span>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full h-4 overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${todayPercentage}%` }}
            />
          </div>
          <p className="text-center text-yellow-200 italic text-sm">"{todayQuote}"</p>
        </div>

        {/* Activities List */}
        <div className="space-y-3 mb-6">
          {activities.filter(activity => !completedToday.includes(activity.id)).length === 0 ? (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 text-center animate-pulse">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Yay! You're all set!</h3>
              <p className="text-lg">See you tomorrow, champion! 💪</p>
            </div>
          ) : (
            activities
              .filter(activity => !completedToday.includes(activity.id))
              .map(activity => (
                <div 
                  key={activity.id}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 transition-all border-2 border-transparent hover:border-purple-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{activity.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.name}</h4>
                        <p className="text-xs text-purple-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.startTime} - {activity.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white bg-opacity-20 hover:bg-opacity-30 hover:bg-green-500"
                      >
                        <span className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="w-8 h-8 rounded-full bg-red-500 bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Add Activity Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all mb-4"
          >
            <Plus className="w-5 h-5" />
            Add New Activity
          </button>
        )}

        {/* Add Activity Form */}
        {showAddForm && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 mb-4">
            <h3 className="font-semibold mb-3">Add New Activity</h3>
            <input
              type="text"
              placeholder="Activity name"
              value={newActivity.name}
              onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
              className="w-full bg-white bg-opacity-20 rounded-lg p-2 mb-2 text-white placeholder-purple-200"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={newActivity.icon}
              onChange={(e) => setNewActivity({...newActivity, icon: e.target.value})}
              className="w-full bg-white bg-opacity-20 rounded-lg p-2 mb-2 text-white placeholder-purple-200"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-purple-200 mb-1 block">Start Time</label>
                <input
                  type="time"
                  value={newActivity.startTime}
                  onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                  className="w-full bg-white bg-opacity-20 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-purple-200 mb-1 block">End Time</label>
                <input
                  type="time"
                  value={newActivity.endTime}
                  onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                  className="w-full bg-white bg-opacity-20 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addActivity}
                className="flex-1 bg-green-500 rounded-lg p-2 font-semibold hover:bg-green-600 transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-red-500 rounded-lg p-2 font-semibold hover:bg-red-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Complete Day Button */}
        <button
          onClick={completeDay}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/50 transition-all mb-4"
        >
          <Trophy className="w-6 h-6" />
          Complete Day {currentDay}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetCycle}
          className="w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-3 text-sm hover:bg-opacity-20 transition-all mb-6"
        >
          Reset Cycle
        </button>

        {/* Cycle Progress */}
        {cycleData.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Journey History
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {cycleData.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      day.percentage >= 80 ? 'bg-green-500' :
                      day.percentage >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  >
                    {day.percentage}%
                  </div>
                  <p className="text-xs mt-1 text-purple-200">D{day.day}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-purple-200 text-xs pt-4 border-t border-white border-opacity-20">
          <p>Developed by <a href="https://github.com/salmanck66" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 underline">github.com/salmanck66</a></p>
          <p className="mt-1">For more apps like this, visit my GitHub</p>
        </div>
      </div>
    </div>
  );
};

export default LifeSuccessJourney;