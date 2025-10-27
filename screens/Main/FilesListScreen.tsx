// screens/Main/FilesListScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

import apiClient from '../../api/client';
import FileCard from '../../components/FileCard';

export default function FilesListScreen({ navigation }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // useIsFocused ensures data is re-fetched when the user navigates back to this screen
  const isFocused = useIsFocused();

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get('/api/files/');
      setFiles(response.data.files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      // Optionally, show a toast or error message to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch files when the screen comes into focus
  React.useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchFiles();
    }
  }, [isFocused]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles();
  }, []);

  // Filter files based on the search query
  const filteredFiles = files.filter(file =>
    file.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search files by name..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {filteredFiles.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text variant="headlineSmall">No Files Found</Text>
            <Text style={styles.emptyText}>Upload a file to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFiles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <FileCard
              file={item}
              onPress={() => navigation.navigate('FileDetail', { fileId: item._id })}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 8,
  },
  searchbar: {
    margin: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: 'gray',
  },
});