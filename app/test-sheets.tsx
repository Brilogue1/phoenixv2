import { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

export default function TestSheetsScreen() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setResult('Fetching...');
    
    try {
      const SHEET_ID = '1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI';
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Flights`;
      
      console.log('Fetching from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const text = await response.text();
      console.log('Response text length:', text.length);
      
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows.map((row: any) => row.c.map((cell: any) => cell?.v || ''));
      
      setResult(`Success! Loaded ${rows.length} rows\n\nFirst row: ${JSON.stringify(rows[0], null, 2)}`);
    } catch (error: any) {
      console.error('Error:', error);
      setResult(`Error: ${error.message}\n\n${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Google Sheets API Test</Text>
      <Button title="Test Fetch" onPress={testFetch} disabled={loading} />
      <Text style={styles.result}>{result}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
