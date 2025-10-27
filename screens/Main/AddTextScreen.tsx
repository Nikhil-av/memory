// screens/Main/AddTextScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, TextInput, Title, Card } from 'react-native-paper';
import apiClient from '../../api/client';
import LoadingOverlay from '../../components/LoadingOverlay';
// Import react-native-fs
import RNFS from 'react-native-fs';

export default function AddTextScreen({ navigation }) {
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadText = async () => {
    // Validate that the required fields are filled
    if (!textContent.trim() || !fileName.trim()) {
      Alert.alert('Missing Information', 'Please provide a filename and some text content.');
      return;
    }

    setIsLoading(true);

    // Ensure the filename ends with .txt
    const finalFileName = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    const filePath = `${RNFS.CachesDirectoryPath}/${finalFileName}`;

    try {
      // 1. Write the user's text content to a temporary .txt file on the device
      await RNFS.writeFile(filePath, textContent, 'utf8');

      // 2. Create a FormData object, just like in the file upload screen
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${filePath}`, // The URI must have the file:// prefix
        name: finalFileName,
        type: 'text/plain', // The MIME type for a .txt file
      });
      formData.append('display_name', finalFileName);
      formData.append('description', description);
      formData.append('tags', tags);

      // 3. Call the exact same API endpoint. The backend thinks it's a normal file upload.
      const response = await apiClient.post('/api/intelligent-files/upload-intelligent', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', response.data.message);
      navigation.goBack();

    } catch (error) {
      console.error('Text Upload failed:', error.response ? JSON.stringify(error.response.data) : error.message);
      Alert.alert('Upload Failed', error.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      // Clean up the temporary file
      RNFS.unlink(filePath).catch(err => console.error("Could not delete temp file", err));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingOverlay visible={isLoading} text="Processing your text with AI..." />
      <Card>
        <Card.Content>
          <Title>Add a Note or Text</Title>
          <TextInput
            label="Filename (e.g., 'Meeting Notes')"
            value={fileName}
            onChangeText={setFileName}
            style={styles.input}
          />
          <TextInput
            label="Type or paste your text here..."
            value={textContent}
            onChangeText={setTextContent}
            multiline={true}
            numberOfLines={10}
            style={styles.textArea}
          />
          <TextInput label="Description (optional)" value={description} onChangeText={setDescription} style={styles.input} />
          <TextInput label="Tags (comma-separated)" value={tags} onChangeText={setTags} style={styles.input} />

          <Button
            icon="upload"
            mode="contained"
            onPress={handleUploadText}
            disabled={isLoading}
            style={styles.button}
          >
            Upload Text
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  input: { marginBottom: 12 },
  textArea: {
    marginBottom: 12,
    height: 200,
    textAlignVertical: 'top',
  },
  button: { marginVertical: 10 },
});