// components/ResendOtpTimer.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface ResendOtpTimerProps {
  onResend: () => void;
}

const ResendOtpTimer: React.FC<ResendOtpTimerProps> = ({ onResend }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(60); // Reset timer
    onResend();
  };

  return (
    <View>
      {timeLeft > 0 ? (
        <Text style={{ textAlign: 'center', marginVertical: 15 }}>
          Resend code in 0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
        </Text>
      ) : (
        <Button onPress={handleResend}>Resend Code</Button>
      )}
    </View>
  );
};

export default ResendOtpTimer;