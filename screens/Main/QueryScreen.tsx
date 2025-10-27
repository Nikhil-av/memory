// screens/Main/QueryScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
  Title,
  Paragraph,
  Chip,
  List,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client';

// This is the main screen for interacting with the AI
export default function QueryScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiClient.post('/api/intelligent-files/query', { query });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while querying.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // A helper component to render the results dynamically
  const renderResults = () => {
    if (loading) {
      return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!result) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="brain" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Ask anything about your files.</Text>
          <Text style={styles.exampleText}>Examples: "Summarize my Q3 reports" or "Find all invoices from September"</Text>
        </View>
      );
    }

    // Response Type 1: AI-generated answer
    if (result.response_type === 'INFORMATION') {
      return (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Title>AI Generated Answer</Title>
            <Paragraph style={styles.answerText}>{result.answer}</Paragraph>
            <Title style={styles.sourceTitle}>Sources</Title>
            {result.source_files.map((file) => (
              <List.Item
                key={file.file_id}
                title={file.filename}
                titleNumberOfLines={1}
                left={() => <List.Icon icon="file-document-outline" />}
                onPress={() => navigation.navigate('FileDetail', { fileId: file.file_id })}
              />
            ))}
          </Card.Content>
        </Card>
      );
    }

    // Response Type 2: List of relevant files
    if (result.response_type === 'FILES') {
      return (
        <Card style={styles.resultCard}>
            <Card.Content>
                 <Title>{result.message || 'Relevant Files Found'}</Title>
                 <FlatList
                    data={result.files}
                    keyExtractor={(item) => item.file_id}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.filename}
                            description={`Relevance: ${(item.relevance_score * 100).toFixed(0)}%`}
                            left={() => <List.Icon icon="file-check-outline" />}
                            onPress={() => navigation.navigate('FileDetail', { fileId: item.file_id })}
                        />
                    )}
                />
            </Card.Content>
        </Card>
      );
    }

    // Response Type 3: No results found
     if (result.files_found === 0) {
      return (
        <Card style={styles.resultCard}>
            <Card.Content>
                <Title>{result.message}</Title>
                {result.suggestions?.map((suggestion, index) => (
                     <Chip key={index} icon="lightbulb-on-outline" style={styles.chip}>{suggestion}</Chip>
                ))}
            </Card.Content>
        </Card>
      );
    }

    return null; // Fallback
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.inputCard}>
        <Card.Content>
          <TextInput
            label="Ask your question..."
            value={query}
            onChangeText={setQuery}
            multiline
            style={styles.textInput}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={handleQuery}
            loading={loading}
            disabled={loading || !query}
            icon="text-box-search-outline"
            style={styles.button}
          >
            Ask AI
          </Button>
        </Card.Content>
      </Card>

      {/* Display the original query */}
      {result && result.query && <Text style={styles.queryEcho}>Your query: "{result.query}"</Text>}

      {renderResults()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  inputCard: {
    margin: 12,
  },
  textInput: {
    marginBottom: 12,
    maxHeight: 150,
  },
  button: {
    paddingVertical: 6,
  },
  loader: {
    marginTop: 30,
  },
  resultCard: {
    marginHorizontal: 12,
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  exampleText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    margin: 20,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sourceTitle: {
    fontSize: 18,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  queryEcho: {
    marginHorizontal: 16,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  chip: {
    marginVertical: 4,
  }
});