import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Trophy, Target, Star, Settings } from 'lucide-react';

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

  const themeConfig = {
    dark: {
      name: 'Dark',
      bg: 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900',
      text: 'text-white',
      border: 'border-white',
      cardBg: 'bg-white bg-opacity-10',
      levelBg: 'bg-gradient-to-br from-purple-600 to-indigo-600',
      levelBorder: 'border-purple-400',
      progressBg: 'bg-gray-700',
      progressFill: 'bg-purple-500',
      btnPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400',
      btnSecondary: 'bg-white text-black',
      inputBg: 'bg-gray-700',
      inputBorder: 'border-white',
      hoverBg: 'hover:bg-white hover:text-black',
      completionBg: 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400'
    },
    light: {
      name: 'Light',
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-black',
      cardBg: 'bg-white',
      levelBg: 'bg-black',
      levelBorder: 'border-black',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-black',
      btnPrimary: 'bg-black border-black',
      btnSecondary: 'bg-white text-black border-black',
      inputBg: 'bg-white',
      inputBorder: 'border-black',
      hoverBg: 'hover:bg-black hover:text-white',
      completionBg: 'bg-black border-black'
    },
    ocean: {
      name: 'Ocean',
      bg: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900',
      text: 'text-white',
      border: 'border-cyan-300',
      cardBg: 'bg-white bg-opacity-10',
      levelBg: 'bg-gradient-to-br from-cyan-600 to-blue-600',
      levelBorder: 'border-cyan-400',
      progressBg: 'bg-blue-800',
      progressFill: 'bg-cyan-400',
      btnPrimary: 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400',
      btnSecondary: 'bg-cyan-400 text-black',
      inputBg: 'bg-blue-800',
      inputBorder: 'border-cyan-300',
      hoverBg: 'hover:bg-cyan-400 hover:text-black',
      completionBg: 'bg-gradient-to-br from-teal-600 to-emerald-600 border-teal-400'
    },
    forest: {
      name: 'Forest',
      bg: 'bg-gradient-to-br from-green-900 via-emerald-800 to-lime-900',
      text: 'text-white',
      border: 'border-green-300',
      cardBg: 'bg-white bg-opacity-10',
      levelBg: 'bg-gradient-to-br from-emerald-600 to-green-600',
      levelBorder: 'border-green-400',
      progressBg: 'bg-green-800',
      progressFill: 'bg-lime-400',
      btnPrimary: 'bg-gradient-to-r from-emerald-600 to-green-600 border-green-400',
      btnSecondary: 'bg-lime-400 text-black',
      inputBg: 'bg-green-800',
      inputBorder: 'border-green-300',
      hoverBg: 'hover:bg-lime-400 hover:text-black',
      completionBg: 'bg-gradient-to-br from-lime-600 to-green-600 border-lime-400'
    },
    sunset: {
      name: 'Sunset',
      bg: 'bg-gradient-to-br from-orange-900 via-red-800 to-pink-900',
      text: 'text-white',
      border: 'border-orange-300',
      cardBg: 'bg-white bg-opacity-10',
      levelBg: 'bg-gradient-to-br from-orange-600 to-red-600',
      levelBorder: 'border-orange-400',
      progressBg: 'bg-red-800',
      progressFill: 'bg-orange-400',
      btnPrimary: 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-400',
      btnSecondary: 'bg-orange-400 text-black',
      inputBg: 'bg-red-800',
      inputBorder: 'border-orange-300',
      hoverBg: 'hover:bg-orange-400 hover:text-black',
      completionBg: 'bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-400'
    }
  };

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
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'ocean', 'forest', 'sunset'
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', startTime: '', endTime: '', icon: '✨' });

  // Get current theme configuration
  const currentTheme = themeConfig[theme];

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lifeSuccessJourney');
    if (saved) {
      const data = JSON.parse(saved);
      setActivities(data.activities || defaultActivities);
      setCycleData(data.cycleData || []);
      setCurrentDay(data.currentDay || 1);
      setCompletedToday(data.completedToday || []);
      setTheme(data.theme || 'dark');
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
      theme,
      lastSaved: new Date().toISOString()
    }));
  }, [activities, cycleData, currentDay, completedToday, theme]);

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
    <div className={`min-h-screen p-4 pb-20 transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>
      {/* Header */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-6 relative">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`absolute top-6 right-0 p-2 rounded-full transition-all ${
              theme === 'light'
                ? 'bg-black bg-opacity-10 hover:bg-opacity-20 text-black' 
                : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
            Life Success
          </h1>
          <div className={`w-16 h-1 mx-auto mb-3 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
          <p className={`text-sm uppercase tracking-wide font-medium ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>21-Day Journey</p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`rounded-none p-6 mb-8 border-4 ${currentTheme.border} ${currentTheme.cardBg}`}>
            <h3 className="font-black uppercase tracking-tight mb-4 text-lg">Settings</h3>
            
            {/* Theme Selector */}
            <div className="mb-6">
              <label className="font-medium mb-3 block">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(themeConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-3 rounded border-2 font-bold uppercase text-sm transition-all ${
                      theme === key 
                        ? `${currentTheme.border} ${currentTheme.btnSecondary}` 
                        : `border-transparent ${currentTheme.cardBg} opacity-60 hover:opacity-100`
                    }`}
                  >
                    {config.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Status */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Notifications</span>
              <span className={`text-sm px-3 py-1 rounded ${
                notificationsEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}

        {/* Level Badge */}
        <div className={`rounded-none p-8 mb-8 border-4 ${currentTheme.levelBg} text-white ${currentTheme.levelBorder}`}>
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
        <div className={`border-4 rounded-none p-6 mb-8 ${currentTheme.border} ${currentTheme.cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Target className="w-5 h-5" />
              TODAY
            </h3>
            <span className="text-4xl font-black">{todayPercentage}%</span>
          </div>
          <div className={`h-3 overflow-hidden ${currentTheme.progressBg}`}>
            <div 
              className={`h-full transition-all duration-500 ${currentTheme.progressFill}`}
              style={{ width: `${todayPercentage}%` }}
            />
          </div>
          <p className={`text-center italic text-sm mt-4 font-medium ${
            theme === 'light' ? 'text-black' : 'text-gray-300'
          }`}>"{todayQuote}"</p>
        </div>

        {/* Activities List */}
        <div className="space-y-4 mb-8">
          {activities.filter(activity => !completedToday.includes(activity.id)).length === 0 ? (
            <div className={`rounded-none p-10 text-center border-4 text-white ${currentTheme.completionBg}`}>
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
                  className={`border-2 rounded-none p-4 transition-all group ${currentTheme.border} ${currentTheme.hoverBg}`}
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
                        className={`w-12 h-12 border-2 rounded-full flex items-center justify-center transition-all ${currentTheme.border} group-hover:border-current`}
                      >
                        <span className="text-xl">✓</span>
                      </button>
                      {!activity.isPermanent && (
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            theme === 'light' 
                              ? 'bg-black text-white group-hover:bg-white group-hover:text-black' 
                              : 'bg-white text-black group-hover:bg-black group-hover:text-white'
                          }`}
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
            className={`w-full rounded-none p-4 font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-all mb-4 border-4 text-white ${currentTheme.btnPrimary} hover:opacity-90`}
          >
            <Plus className="w-5 h-5" />
            Add Activity
          </button>
        )}

        {/* Add Activity Form */}
        {showAddForm && (
          <div className={`border-4 rounded-none p-6 mb-4 ${currentTheme.border} ${currentTheme.cardBg}`}>
            <h3 className="font-black uppercase tracking-tight mb-4 text-lg">New Activity</h3>
            <input
              type="text"
              placeholder="ACTIVITY NAME"
              value={newActivity.name}
              onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
              className={`w-full border-2 rounded-none p-3 mb-3 uppercase font-medium focus:outline-none placeholder-gray-400 ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text}`}
            />
            <input
              type="text"
              placeholder="ICON (EMOJI)"
              value={newActivity.icon}
              onChange={(e) => setNewActivity({...newActivity, icon: e.target.value})}
              className={`w-full border-2 rounded-none p-3 mb-3 uppercase font-medium focus:outline-none placeholder-gray-400 ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text}`}
            />
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wide mb-2 block">Start Time</label>
                <input
                  type="time"
                  value={newActivity.startTime}
                  onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                  className={`w-full border-2 rounded-none p-3 font-medium focus:outline-none ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text}`}
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wide mb-2 block">End Time</label>
                <input
                  type="time"
                  value={newActivity.endTime}
                  onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                  className={`w-full border-2 rounded-none p-3 font-medium focus:outline-none ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text}`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addActivity}
                className={`flex-1 rounded-none p-3 font-black uppercase transition-all ${currentTheme.btnSecondary} border-2 ${currentTheme.border}`}
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className={`flex-1 border-2 rounded-none p-3 font-black uppercase transition-all ${currentTheme.border} ${currentTheme.hoverBg}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Complete Day Button */}
        <button
          onClick={completeDay}
          className={`w-full rounded-none p-5 font-black uppercase text-lg tracking-wide flex items-center justify-center gap-3 transition-all mb-4 border-4 text-white ${currentTheme.btnPrimary} hover:opacity-90`}
        >
          <Trophy className="w-6 h-6" />
          Complete Day {currentDay}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetCycle}
          className={`w-full border-2 rounded-none p-3 text-sm font-black uppercase tracking-wide transition-all mb-8 ${currentTheme.border} ${currentTheme.hoverBg}`}
        >
          Reset Cycle
        </button>

        {/* Cycle Progress */}
        {cycleData.length > 0 && (
          <div className={`border-4 rounded-none p-6 mb-8 ${currentTheme.border} ${currentTheme.cardBg}`}>
            <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-lg">
              <Star className="w-5 h-5" />
              History
            </h3>
            <div className="grid grid-cols-7 gap-3">
              {cycleData.map((day, idx) => (
                <div key={idx} className="text-center">
                  <div 
                    className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-black ${
                      theme === 'light' 
                        ? day.percentage >= 80 ? 'bg-black text-white border-black' :
                          day.percentage >= 50 ? 'bg-gray-300 text-black border-black' :
                          'bg-white text-black border-black'
                        : day.percentage >= 80 ? 'bg-green-600 text-white border-green-400' :
                          day.percentage >= 50 ? 'bg-yellow-600 text-white border-yellow-400' :
                          'bg-red-600 text-white border-red-400'
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
        <div className={`text-center text-xs pt-6 border-t-2 ${currentTheme.border} ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <p className="uppercase tracking-wide font-medium">Developed by <a href="https://github.com/salmanck66" target="_blank" rel="noopener noreferrer" className={`font-black hover:underline ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}>SALMANCK66</a></p>
          <p className="mt-1 uppercase tracking-wide">More apps on GitHub</p>
        </div>
      </div>
    </div>
  );
};

export default LifeSuccessJourney;