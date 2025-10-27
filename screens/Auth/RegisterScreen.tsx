// screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import apiClient from '../../api/client';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await apiClient.post('/api/auth/send-otp', { email });
      navigation.navigate('OtpVerification', { email, purpose: 'verification' });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Create an Account</Title>
          <TextInput label="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ marginVertical: 20 }} />
          <Button mode="contained" onPress={handleSendOtp} loading={loading} disabled={loading}>
            Send Verification Code
          </Button>
           <Button onPress={() => navigation.navigate('Login')} style={{marginTop: 15}}>
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});