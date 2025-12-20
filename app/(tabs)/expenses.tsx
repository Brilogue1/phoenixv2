import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GradientBackground } from '@/components/gradient-background';
import { useUserProfile } from '@/hooks/use-user-profile';
import { submitExpense } from '@/lib/google-sheets';

export default function ExpensesScreen() {
  const { profile } = useUserProfile();
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Use demo profile if not logged in
  const displayProfile = profile || {
    name: 'Demo User',
    email: 'demo@phoenixdm.co',
    team: 'KYT2',
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos to upload receipts.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take receipt photos.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setReceiptImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category');
      return;
    }

    try {
      setSubmitting(true);

      const result = await submitExpense({
        employeeName: displayProfile.name,
        employeeEmail: displayProfile.email,
        team: displayProfile.team,
        date,
        category: category.trim(),
        amount: parseFloat(amount),
        description: description.trim(),
        receiptImageUri: receiptImage || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Expense submitted successfully!');
        // Reset form
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setCategory('');
        setDescription('');
        setReceiptImage(null);
      } else {
        Alert.alert('Error', result.message || 'Failed to submit expense');
      }
    } catch (error) {
      console.error('Expense submission error:', error);
      Alert.alert('Error', 'Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <ScrollView
          contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <ThemedText type="title" style={styles.title}>
          Submit Expense
        </ThemedText>

        {/* Date */}
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Date
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            value={date}
            onChangeText={setDate}
          />
        </View>

        {/* Amount */}
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Amount
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Category */}
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Category
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g., Meals, Transportation, Lodging"
            placeholderTextColor="#999"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Description
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes about this expense..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Receipt Image */}
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Receipt Photo
          </ThemedText>
          
          {receiptImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: receiptImage }} style={styles.receiptImage} contentFit="cover" />
              <Pressable
                style={styles.removeImageButton}
                onPress={() => setReceiptImage(null)}
              >
                <ThemedText style={styles.removeImageText}>✕ Remove</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.imageButtons}>
              <Pressable style={styles.imageButton} onPress={takePhoto}>
                <ThemedText style={styles.imageButtonText}>📷 Take Photo</ThemedText>
              </Pressable>
              <Pressable style={styles.imageButton} onPress={pickImage}>
                <ThemedText style={styles.imageButtonText}>🖼️ Choose from Library</ThemedText>
              </Pressable>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.submitButtonText}>
              Submit Expense
            </ThemedText>
          )}
        </Pressable>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#5B6FED',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#5B6FED',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
