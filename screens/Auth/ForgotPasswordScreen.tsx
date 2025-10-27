// screens/Auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import apiClient from '../../api/client';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      navigation.navigate('OtpVerification', { email, purpose: 'password_reset' });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Could not send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Reset Password</Title>
          <TextInput label="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ marginVertical: 20 }} />
          <Button mode="contained" onPress={handleSendCode} loading={loading} disabled={loading}>
            Send Reset Code
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});