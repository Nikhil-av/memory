// screens/Main/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Button, ActivityIndicator, Avatar } from 'react-native-paper';
// 1. IMPORT the useIsFocused hook
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // 2. CALL the hook to get the focus state
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchProfile = async () => {
      // We only want to fetch if the screen is focused
      if (isFocused) {
        try {
          console.log("Dashboard focused, fetching stats..."); // For debugging
          const response = await apiClient.get('/api/users/me');
          setStats(response.data.user.stats);
        } catch (error) {
          console.error('Failed to fetch profile', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
    // 3. ADD isFocused to the dependency array.
    // This tells React to re-run the effect whenever the focus state changes.
  }, [isFocused]);

  if (loading && !stats) { // Only show full-screen loader on the initial load
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`Hello, ${user?.username}!`}
          subtitle="Here is your file intelligence overview"
          left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
        />
        <Card.Content>
          <Title>Your Stats</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.total_files ?? 0}</Text>
              <Text style={styles.statLabel}>Total Files</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.storage_used_mb?.toFixed(2) ?? 0} MB</Text>
              <Text style={styles.statLabel}>Storage Used</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* The rest of your component remains the same... */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
           <Button icon="text-box-search-outline" mode="contained" onPress={() => navigation.navigate('Query')} style={styles.actionButton}>
            Ask AI About Your Files
          </Button>
          <Button icon="note-plus-outline" mode="outlined" onPress={() => navigation.navigate('AddText')} style={styles.actionButton}>
            Add a Text Note
          </Button>
          <Button icon="upload" mode="outlined" onPress={() => navigation.navigate('Upload')} style={styles.actionButton}>
            Upload a New File
          </Button>
          <Button icon="folder" mode="outlined" onPress={() => navigation.navigate('Files')} style={styles.actionButton}>
            Browse All Files
          </Button>
        </Card.Content>
      </Card>

      <Button onPress={logout} style={{ margin: 20 }}>Logout</Button>
    </ScrollView>
  );
}

// Your styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f2f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginVertical: 8 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 14, color: 'gray' },
  actionButton: { marginVertical: 8, paddingVertical: 6 },
});