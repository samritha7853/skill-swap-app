import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function SearchScreen() {
  const [skill, setSkill] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search</Text>
      <InputField label="Skill" value={skill} onChangeText={setSkill} />
      <InputField label="College" value={college} onChangeText={setCollege} />
      <InputField label="Department" value={department} onChangeText={setDepartment} />
      <CustomButton title="Search" onPress={() => {}} />
      <View style={styles.result}>
        <Text style={styles.resultTitle}>Results will appear here</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  result: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  resultTitle: {
    fontSize: 16,
    color: '#555',
  },
});
