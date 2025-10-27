// screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      // Handle the new 403 error for unverified emails
      if (err.response?.status === 403) {
        Alert.alert(
            "Email Not Verified",
            "Please check your inbox to verify your email before logging in.",
            [
                { text: "OK" },
                { text: "Resend Code", onPress: () => resendVerification(email) }
            ]
        );
      } else {
        setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (userEmail: string) => {
      try {
          await apiClient.post('/api/auth/resend-otp', { email: userEmail, purpose: 'verification'});
          Alert.alert('Success', 'A new verification code has been sent to your email.');
      } catch (e) {
          Alert.alert('Error', 'Could not resend the code.');
      }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Welcome Back!" titleStyle={styles.title} />
        <Card.Content>
          <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotButton}>
             Forgot Password?
          </Button>
          <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
            Login
          </Button>
          <Button onPress={() => navigation.navigate('Register')} style={styles.switchButton}>
            Don't have an account? Register
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  card: { padding: 10 },
  title: { fontSize: 24, textAlign: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 10 },
  switchButton: { marginTop: 12 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 10 },
  errorText: { color: 'red', marginVertical: 10, textAlign: 'center' },
});