// screens/Auth/OtpVerificationScreen.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import OtpInput from '../../components/OtpInput';
import ResendOtpTimer from '../../components/ResendOtpTimer';
import apiClient from '../../api/client';

export default function OtpVerificationScreen({ route, navigation }) {
  const { email, purpose } = route.params;

  const handleCodeFilled = (otp: string) => {
    if (purpose === 'verification') {
      // For registration, we just pass the OTP and email to the next step
      navigation.navigate('CompleteProfile', { email, otp });
    } else if (purpose === 'password_reset') {
      // For password reset, we verify the OTP here
      verifyResetOtp(otp);
    }
  };

  const verifyResetOtp = async (otp: string) => {
     try {
        await apiClient.post('/api/auth/verify-reset-otp', { email, otp });
        navigation.navigate('ResetPassword', { email, otp });
     } catch (error) {
        Alert.alert('Error', error.response?.data?.error || 'Invalid OTP. Please try again.');
     }
  };

  const handleResend = async () => {
    try {
      await apiClient.post('/api/auth/resend-otp', { email, purpose });
      Alert.alert('Success', 'A new OTP has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Could not resend OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Verify Your Email</Title>
          <Paragraph>A 6-digit code has been sent to {email}.</Paragraph>
          <OtpInput onCodeFilled={handleCodeFilled} />
          <ResendOtpTimer onResend={handleResend} />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});