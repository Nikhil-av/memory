// components/FileCard.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip, Avatar } from 'react-native-paper';

// Define the structure of the file prop
interface FileProps {
  _id: string;
  display_name: string;
  file_type: string;
  size_mb: number;
  tags: string[];
  created_at: string;
}

interface FileCardProps {
  file: FileProps;
  onPress: () => void;
}

// A map to associate file types with icons
const fileTypeIcons = {
  document: 'file-document-outline',
  image: 'file-image-outline',
  spreadsheet: 'file-excel-outline',
  presentation: 'file-powerpoint-outline',
  other: 'file-question-outline',
};

const FileCard: React.FC<FileCardProps> = ({ file, onPress }) => {
  // Format the date for better readability
  const formattedDate = new Date(file.created_at).toLocaleDateString();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={file.display_name}
        titleNumberOfLines={1}
        subtitle={`${file.size_mb.toFixed(2)} MB  â€¢  ${formattedDate}`}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={fileTypeIcons[file.file_type] || fileTypeIcons.other}
            style={{ backgroundColor: '#eef5ff' }}
            color="#1680fe"
          />
        )}
      />
      {file.tags && file.tags.length > 0 && (
        <Card.Content>
          <View style={styles.tagContainer}>
            {file.tags.map((tag, index) => (
              <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#dfefff',
  },
  chipText: {
    color: '#0053a0',
  },
});

export default FileCard;