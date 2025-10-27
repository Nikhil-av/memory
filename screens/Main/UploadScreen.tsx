// screens/Main/UploadScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title, Card } from 'react-native-paper';
// 1. IMPORT from the library you used in your old code
import { pick, types } from '@react-native-documents/picker';
import apiClient from '../../api/client';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function UploadScreen({ navigation }) {
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectFile = async () => {
    try {
      // 2. USE the `pick` method from the old library.
      // The result is an array, so we destructure it to get the first file.
      const [fileFromPicker] = await pick({
        type: [types.allFiles],
        copyTo: 'documentDirectory', // This ensures the file is copied to a stable location
      });

      // 3. HANDLE the result. If the user cancels, `fileFromPicker` will be undefined.
      if (fileFromPicker) {
        setFile(fileFromPicker);
      } else {
        console.log('User cancelled the picker.');
      }
    } catch (err) {
      // This library doesn't usually throw for cancellation, but we keep the catch for other errors.
      console.error('File selection error:', err);
      Alert.alert('Error', 'An unexpected error occurred while picking the file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert('No file selected', 'Please select a file to upload.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      // 4. The property for mime type is `file.type`, which is consistent.
      type: file.type,
    });
    formData.append('display_name', displayName || file.name);
    formData.append('description', description);
    formData.append('tags', tags);

    try {
      const response = await apiClient.post('/api/intelligent-files/upload-intelligent', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', response.data.message);
      navigation.goBack();
    } catch (error) {
      console.error('Upload failed:', JSON.stringify(error.response, null, 2));
      Alert.alert('Upload Failed', error.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={isLoading} text="Processing your file with AI..." />
      <Card>
        <Card.Content>
          <Title>Upload & Process File</Title>
          <Button icon="file-document-outline" mode="outlined" onPress={selectFile} style={styles.button}>
            {file ? `Selected: ${file.name}` : 'Select a File'}
          </Button>

          <TextInput label="Display Name (optional)" value={displayName} onChangeText={setDisplayName} style={styles.input} />
          <TextInput label="Description (optional)" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput label="Tags (comma-separated)" value={tags} onChangeText={setTags} style={styles.input} />

          <Button
            icon="upload"
            mode="contained"
            onPress={handleUpload}
            disabled={!file || isLoading}
            style={styles.button}
          >
            Upload and Process
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  input: { marginBottom: 12 },
  button: { marginVertical: 10 },
});