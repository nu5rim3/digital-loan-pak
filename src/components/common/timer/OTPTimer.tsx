import React, { useState, useEffect } from 'react';

interface OTPTimerProps {
  duration: number; // duration in seconds
  onTimerEnd: () => void;
  resetTrigger: number; // Increment this value from parent to reset the timer
}

const OTPTimer: React.FC<OTPTimerProps> = ({ duration, onTimerEnd, resetTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // Reset the timer whenever resetTrigger changes
  }, [resetTrigger, duration]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimerEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimerEnd]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default OTPTimer;
