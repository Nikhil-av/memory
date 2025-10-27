// screens/Main/FileDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import {
  ActivityIndicator,
  Card,
  Text,
  Title,
  Paragraph,
  Button,
  List,
  Chip,
  Avatar,
} from 'react-native-paper';
// 1. Import WebView
import { WebView } from 'react-native-webview';
import apiClient from '../../api/client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const fileTypeIcons = {
  document: 'file-document-outline',
  image: 'file-image-outline',
  spreadsheet: 'file-excel-outline',
  presentation: 'file-powerpoint-outline',
  other: 'file-question-outline',
};

export default function FileDetailScreen({ route, navigation }) {
  const { fileId } = route.params;
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // 2. Add state to control a pop-up modal for the download
  const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);

  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!fileId) {
        setError('No file ID provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get(`/api/files/${fileId}`);
        setFileDetails(response.data.file);
        navigation.setOptions({ title: response.data.file.display_name });
      } catch (err) {
        setError('Failed to load file details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFileDetails();
  }, [fileId]);

  // 3. This function now simply opens the download modal
  const handleDownload = () => {
    if (!fileDetails?.cloudinary?.secure_url) {
      Alert.alert('Error', 'No download URL available.');
      return;
    }
    setDownloadModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  if (error) {
    return <View style={styles.loader}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (!fileDetails) {
    return <View style={styles.loader}><Text>No file data found.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* --- Main Info Card --- */}
        <Card style={styles.card}>
          <Card.Title
            title={fileDetails.display_name}
            titleStyle={styles.mainTitle}
            subtitle={`Uploaded on ${new Date(fileDetails.created_at).toLocaleDateString()}`}
            left={(props) => (
              <Avatar.Icon {...props} icon={fileTypeIcons[fileDetails.file_type] || fileTypeIcons.other} />
            )}
          />
          <Card.Actions>
            <Button icon="download" onPress={handleDownload}>
              Download File
            </Button>
          </Card.Actions>
        </Card>

{/* --- AI Summaries Card --- */}

{fileDetails.summary && (

<Card style={styles.card}>

<Card.Content>

<Title>AI Summaries</Title>

{fileDetails.summary.short && (

<>

<Text style={styles.summaryTitle}>Short</Text>

<Paragraph>{fileDetails.summary.short}</Paragraph>

</>

)}

{fileDetails.summary.medium && (

<>

<Text style={styles.summaryTitle}>Medium</Text>

<Paragraph>{fileDetails.summary.medium}</Paragraph>

</>

)}

</Card.Content>

</Card>

)}



{/* --- AI Analysis Card --- */}

{fileDetails.ai_analysis && (

<Card style={styles.card}>

<Card.Content>

<Title>AI Analysis</Title>

<List.Accordion title="Topics" id="1" left={props => <List.Icon {...props} icon="tag-multiple-outline" />}>

<View style={styles.chipContainer}>

{fileDetails.ai_analysis.topics?.map((topic, index) => (

<Chip key={index} style={styles.chip}>{topic}</Chip>

))}

</View>

</List.Accordion>

<List.Accordion title="Entities" id="2" left={props => <List.Icon {...props} icon="account-group-outline" />}>

{fileDetails.ai_analysis.entities?.people?.length > 0 && <List.Item title={`People: ${fileDetails.ai_analysis.entities.people.join(', ')}`} />}

{fileDetails.ai_analysis.entities?.organizations?.length > 0 && <List.Item title={`Organizations: ${fileDetails.ai_analysis.entities.organizations.join(', ')}`} />}

{fileDetails.ai_analysis.entities?.dates?.length > 0 && <List.Item title={`Dates: ${fileDetails.ai_analysis.entities.dates.join(', ')}`} />}

</List.Accordion>

<List.Item

title={`Sentiment: ${fileDetails.ai_analysis.sentiment}`}

left={props => <List.Icon {...props} icon="emoticon-happy-outline" />}

/>

</Card.Content>

</Card>

)}



{/* --- Metadata Card --- */}

{fileDetails.metadata && (

<Card style={styles.card}>

<Card.Content>

<Title>File Metadata</Title>

{fileDetails.metadata.author && <List.Item title={`Author: ${fileDetails.metadata.author}`} left={props => <List.Icon {...props} icon="account-edit-outline"/>} />}

{fileDetails.metadata.page_count && <List.Item title={`Page Count: ${fileDetails.metadata.page_count}`} left={props => <List.Icon {...props} icon="book-open-page-variant-outline"/>} />}

{fileDetails.metadata.word_count && <List.Item title={`Word Count: ${fileDetails.metadata.word_count}`} left={props => <List.Icon {...props} icon="format-letter-case"/>} />}

</Card.Content>

</Card>

)}
      </ScrollView>

      {/* 4. This Modal contains the WebView that handles the download */}
      <Modal
        visible={isDownloadModalVisible}
        onRequestClose={() => setDownloadModalVisible(false)}
        animationType="slide"
      >
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: fileDetails.cloudinary.secure_url }}
            onLoadStart={() => console.log('WebView download started...')}
            onLoadEnd={() => {
              // The download triggers automatically in the background.
              // We close the modal after a short delay and notify the user.
              setTimeout(() => {
                setDownloadModalVisible(false);
                Alert.alert("Download Started", "Your file is being saved. Check your device's notification bar for progress.");
              }, 2000); // Wait 2 seconds
            }}
          />
          <Button onPress={() => setDownloadModalVisible(false)} style={styles.closeButton}>
            Close
          </Button>
        </View>
      </Modal>
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
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  mainTitle: {
      fontSize: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  chip: {
    margin: 4,
  },
  errorText: {
    color: 'red',
  },
  // Style for the close button in the modal
  closeButton: {
    padding: 10,
    margin: 10,
  },
});