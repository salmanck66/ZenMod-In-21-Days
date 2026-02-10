import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Trophy, Target, Star } from 'lucide-react';

const defaultActivities = [
  { id: 1, name: 'Wake Up', time: '06:00', icon: '🌅', isPermanent: true, type: 'single' },
  { id: 2, name: 'Prayer', startTime: '06:30', endTime: '07:00', icon: '🙏', isPermanent: false, type: 'range' },
  { id: 3, name: 'Workout', startTime: '07:00', endTime: '08:00', icon: '💪', isPermanent: false, type: 'range' },
  { id: 4, name: 'Read Book', startTime: '20:00', endTime: '21:00', icon: '📚', isPermanent: false, type: 'range' },
  { id: 5, name: 'Sleep', time: '22:00', icon: '😴', isPermanent: true, type: 'single' },
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
        if (completedToday.includes(activity.id)) return;

        // For single time activities (Wake Up, Sleep)
        if (activity.type === 'single' && activity.time === currentTime) {
          new Notification('Time for your activity!', {
            body: `${activity.icon} ${activity.name} - Let's do this!`,
            icon: '🎯'
          });
        }
        
        // For range activities (Prayer, Workout, etc.)
        if (activity.type === 'range') {
          // Start notification
          if (activity.startTime === currentTime) {
            new Notification('Time to start!', {
              body: `${activity.icon} ${activity.name} - Let's do this!`,
              icon: '🎯'
            });
          }
          // End notification
          if (activity.endTime === currentTime) {
            new Notification('Activity ending soon!', {
              body: `${activity.icon} ${activity.name} - Have you finished?`,
              icon: '⏰'
            });
          }
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
        ...newActivity,
        isPermanent: false,
        type: 'range'
      };
      setActivities(sortActivities([...activities, activity]));
      setNewActivity({ name: '', startTime: '', endTime: '', icon: '✨' });
      setShowAddForm(false);
    }
  };

  const sortActivities = (activitiesList) => {
    const wakeUp = activitiesList.find(a => a.name === 'Wake Up');
    const sleep = activitiesList.find(a => a.name === 'Sleep');
    const others = activitiesList.filter(a => a.name !== 'Wake Up' && a.name !== 'Sleep');
    
    return [
      ...(wakeUp ? [wakeUp] : []),
      ...others,
      ...(sleep ? [sleep] : [])
    ];
  };

  const deleteActivity = (id) => {
    const activity = activities.find(a => a.id === id);
    if (activity && activity.isPermanent) {
      alert('Wake Up and Sleep are essential activities and cannot be deleted!');
      return;
    }
    setActivities(activities.filter(a => a.id !== id));
    setCompletedToday(completedToday.filter(actId => actId !== id));
  };

  const updateActivityTime = (id, newTime) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, time: newTime } : a
    ));
  };

  const updateActivityRange = (id, field, value) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
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
    <div className="min-h-screen bg-white text-black p-4 pb-20">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
            Zen21
          </h1>
          <div className="w-16 h-1 bg-black mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">21-Day Journey</p>
        </div>

        {/* Level Badge */}
        <div className="bg-black text-white rounded-none p-8 mb-8 border-4 border-black">
          <div className="text-center">
            <div className="text-5xl mb-3">{level.icon}</div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{level.name}</h2>
            <p className="text-sm opacity-90 font-medium">DAY {currentDay} OF 21</p>
            <div className="mt-4 bg-white h-2 overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${(currentDay / 21) * 100}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-75 font-medium uppercase tracking-wide">
              {currentDay} / 21 DAYS
            </p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="border-4 border-black rounded-none p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5" />
              TODAY
            </h3>
            <span className="text-4xl font-black">{todayPercentage}%</span>
          </div>
          <div className="bg-gray-200 h-3 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${todayPercentage}%` }}
            />
          </div>
          <p className="text-center text-black italic text-sm mt-4 font-medium">"{todayQuote}"</p>
        </div>

        {/* Activities List */}
        <div className="space-y-4 mb-8">
          {activities.filter(activity => !completedToday.includes(activity.id)).length === 0 ? (
            <div className="bg-black text-white rounded-none p-10 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-black uppercase mb-3">ALL DONE!</h3>
              <p className="text-lg font-medium">See you tomorrow, champion!</p>
            </div>
          ) : (
            activities
              .filter(activity => !completedToday.includes(activity.id))
              .map(activity => (
                <div 
                  key={activity.id}
                  className="border-2 border-black rounded-none p-4 transition-all hover:bg-black hover:text-white group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl">{activity.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-black uppercase tracking-tight text-lg">{activity.name}</h4>
                        {activity.type === 'single' ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            <input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivityTime(activity.id, e.target.value)}
                              className="bg-transparent text-sm border-none outline-none cursor-pointer font-medium group-hover:text-white"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            <input
                              type="time"
                              value={activity.startTime}
                              onChange={(e) => updateActivityRange(activity.id, 'startTime', e.target.value)}
                              className="bg-transparent text-sm border-none outline-none cursor-pointer font-medium group-hover:text-white w-16"
                            />
                            <span className="text-sm font-medium">-</span>
                            <input
                              type="time"
                              value={activity.endTime}
                              onChange={(e) => updateActivityRange(activity.id, 'endTime', e.target.value)}
                              className="bg-transparent text-sm border-none outline-none cursor-pointer font-medium group-hover:text-white w-16"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className="w-12 h-12 border-2 border-black group-hover:border-white rounded-full flex items-center justify-center transition-all hover:bg-white hover:text-black"
                      >
                        <span className="text-xl">✓</span>
                      </button>
                      {!activity.isPermanent && (
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="w-10 h-10 bg-black text-white group-hover:bg-white group-hover:text-black rounded-full flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
            className="w-full bg-black text-white rounded-none p-4 font-black uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-all mb-4 border-4 border-black"
          >
            <Plus className="w-5 h-5" />
            Add Activity
          </button>
        )}

        {/* Add Activity Form */}
        {showAddForm && (
          <div className="border-4 border-black rounded-none p-6 mb-4 bg-white">
            <h3 className="font-black uppercase tracking-tight mb-4 text-lg">New Activity</h3>
            <input
              type="text"
              placeholder="ACTIVITY NAME"
              value={newActivity.name}
              onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
              className="w-full border-2 border-black rounded-none p-3 mb-3 text-black placeholder-gray-400 uppercase font-medium focus:outline-none focus:border-gray-600"
            />
            <input
              type="text"
              placeholder="ICON (EMOJI)"
              value={newActivity.icon}
              onChange={(e) => setNewActivity({...newActivity, icon: e.target.value})}
              className="w-full border-2 border-black rounded-none p-3 mb-3 text-black placeholder-gray-400 uppercase font-medium focus:outline-none focus:border-gray-600"
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wide mb-2 block">Start Time</label>
                <input
                  type="time"
                  value={newActivity.startTime}
                  onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                  className="w-full border-2 border-black rounded-none p-3 text-black font-medium focus:outline-none focus:border-gray-600"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wide mb-2 block">End Time</label>
                <input
                  type="time"
                  value={newActivity.endTime}
                  onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                  className="w-full border-2 border-black rounded-none p-3 text-black font-medium focus:outline-none focus:border-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addActivity}
                className="flex-1 bg-black text-white rounded-none p-3 font-black uppercase hover:bg-gray-800 transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 border-2 border-black text-black rounded-none p-3 font-black uppercase hover:bg-black hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Complete Day Button */}
        <button
          onClick={completeDay}
          className="w-full bg-black text-white rounded-none p-5 font-black uppercase text-lg tracking-wide flex items-center justify-center gap-3 hover:bg-gray-800 transition-all mb-4 border-4 border-black"
        >
          <Trophy className="w-6 h-6" />
          Complete Day {currentDay}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetCycle}
          className="w-full border-2 border-black text-black rounded-none p-3 text-sm font-black uppercase tracking-wide hover:bg-black hover:text-white transition-all mb-8"
        >
          Reset Cycle
        </button>

        {/* Cycle Progress */}
        {cycleData.length > 0 && (
          <div className="border-4 border-black rounded-none p-6 mb-8 bg-white">
            <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-lg">
              <Star className="w-5 h-5" />
              History
            </h3>
            <div className="grid grid-cols-7 gap-3">
              {cycleData.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className={`w-12 h-12 border-2 border-black flex items-center justify-center text-xs font-black ${
                      day.percentage >= 80 ? 'bg-black text-white' :
                      day.percentage >= 50 ? 'bg-gray-300 text-black' :
                      'bg-white text-black'
                    }`}
                  >
                    {day.percentage}%
                  </div>
                  <p className="text-xs mt-1 font-bold">D{day.day}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs pt-6 border-t-2 border-black">
          <p className="uppercase tracking-wide font-medium">Developed by <a href="https://github.com/salmanck66" target="_blank" rel="noopener noreferrer" className="text-black font-black hover:underline">SALMANCK66</a></p>
          <p className="mt-1 uppercase tracking-wide">More apps on GitHub</p>
        </div>
      </div>
    </div>
  );
};

export default LifeSuccessJourney;