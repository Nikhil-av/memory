// screens/Auth/CompleteProfileScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

export default function CompleteProfileScreen({ route }) {
  const { email, otp } = route.params;
  const { register } = useAuth(); // We'll use the register function from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    setLoading(true);
    try {
      await register({
        email,
        otp,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      // On success, the RootNavigator will automatically switch to the main app
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Complete Your Profile</Title>
          <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TextInput label="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
          <TextInput label="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
          <Button mode="contained" onPress={handleRegistration} loading={loading} disabled={loading} style={{ marginTop: 10 }}>
            Create Account
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