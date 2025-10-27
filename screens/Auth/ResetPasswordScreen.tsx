// screens/Auth/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import apiClient from '../../api/client';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, otp } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/auth/reset-password', { email, otp, new_password: newPassword });
      Alert.alert('Success', 'Your password has been reset. Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Set New Password</Title>
          <TextInput label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
          <TextInput label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
          <Button mode="contained" onPress={handleReset} loading={loading} disabled={loading} style={{ marginTop: 10 }}>
            Reset Password
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { marginVertical: 8 },
});