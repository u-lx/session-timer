import React, {useState, useEffect} from 'react';
import './App.css';

export default function App () {
  const [clockType, setClockType] = useState('session');
  const [breakLen, setBreakLen] = useState(5);
  const [sessionLen, setSessionLen] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [play, setPlay] = useState(false);

  const timeFormat = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const audio = document.getElementById('beep');

  const handleBreakDecrement = () => {
    if(breakLen > 1) {
      setBreakLen(breakLen-1);
    }
  }

  const handleBreakIncrement = () => {
    if(breakLen < 60) {
      setBreakLen(breakLen+1);
    }
  }

  const handleSessionDecrement = () => {
    if(sessionLen > 1) {
      setSessionLen(sessionLen-1);
      setTimeLeft(timeLeft-60);
    }
  }

  const handleSessionIncrement = () => {
    if(sessionLen < 60) {
      setSessionLen(sessionLen+1);
      setTimeLeft(timeLeft+60);
    }
  }

  const handlePlay = () => {
    setPlay(!play);
  }

  const handleReset = () => {
    setPlay(false);
    audio.pause();
    audio.currentTime = 0;
    setClockType('session');
    setTimeLeft(1500);
    setSessionLen(25);
    setBreakLen(5);
  }

  const resetAtZero = () => {
    if(timeLeft<0 && clockType === 'session') {
      audio.play();
      setClockType('break');
      setTimeLeft(breakLen * 60);
    }
    if(timeLeft<0 && clockType === 'break') {
      audio.play();
      setClockType('session');
      setTimeLeft(sessionLen * 60);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(timeLeft >= -1 && play) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000)
    resetAtZero();
    return () => clearTimeout(timeout);
  }, [timeLeft, play])

  return (
    <div id='container'>
      <h1>25 + 5 Clock</h1>
      <div id='flexbox'>
        <div id='set-break'>
          <h2 id='break-label'>Break Length</h2>
          <button id='break-increment' onClick={handleBreakIncrement} disabled={play}>Break Increment</button>
          <div id='break-length'>{breakLen}</div>
          <button id='break-decrement' onClick={handleBreakDecrement} disabled={play}>Break Decrement</button>
        </div>
        <div id='set-session'>
          <h2 id='session-label'>Session Length</h2>
          <button id='session-increment'  onClick={handleSessionIncrement} disabled={play}>Session Increment</button>
          <div id='session-length'>{sessionLen}</div>
          <button id='session-decrement'  onClick={handleSessionDecrement} disabled={play}>Session Decrement</button>
        </div>
      </div>
      <div id='clock-display'>
        <h2 id='timer-label'>Current: {clockType === 'session' ? 'Session' : 'Break'}</h2>
        <div id='time-left'>{timeFormat()}</div>
        <button id='start_stop' onClick={handlePlay}>Start/Stop</button>
        <button id='reset' onClick={handleReset}>Reset</button>
      </div>
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav">
  </audio>
    </div>
  )
}
