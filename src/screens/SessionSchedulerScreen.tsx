import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { dbService } from '../services/dbService';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SessionSchedulerScreen({ route, navigation }: any) {
  const { partnerId, partnerName, partnerImage } = route.params;
  
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Skill selection
  const offeredSkills = currentUser?.skillsOffered || ['React Native'];
  const [selectedOffer, setSelectedOffer] = useState(offeredSkills[0] || '');
  const [wantedSkill, setWantedSkill] = useState('');

  // Date and Time inputs
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [reminders, setReminders] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  // Quick Date presets
  const handleSelectPresetDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const dateString = d.toISOString().split('T')[0];
    setDate(dateString);
  };

  const handleSelectPresetTime = (presetTime: string) => {
    setTime(presetTime);
  };

  const handleScheduleSubmit = async () => {
    if (!date.trim() || !time.trim()) {
      Alert.alert('Validation Error', 'Please specify a proposed Date and Time.');
      return;
    }
    if (!wantedSkill.trim()) {
      Alert.alert('Validation Error', 'Please write the skill you want to learn from ' + partnerName);
      return;
    }

    try {
      setScheduling(true);

      // Create Swap Request which holds the schedule details
      await dbService.sendSwapRequest({
        senderId: currentUser?.uid || 'currentUser',
        senderName: currentUser?.fullName || 'Sam',
        senderImage: currentUser?.profileImage,
        receiverId: partnerId,
        receiverName: partnerName,
        receiverImage: partnerImage,
        skillOffered: selectedOffer,
        skillWanted: wantedSkill,
        notes: `Proposed Swap Session: Date: ${date}, Time: ${time}. Notes: ${notes}`,
        status: 'pending',
      });

      // Also create a Scheduled Session in Redux directly for the calendar view
      await dbService.scheduleSwapSession({
        partnerId,
        partnerName,
        partnerImage,
        date,
        time,
        notes,
        reminders,
      });

      Alert.alert(
        'Swap Request Sent',
        `A swap proposal has been sent to ${partnerName}. They will be notified to accept.`,
        [{ text: 'Great', onPress: () => navigation.navigate('Requests') }]
      );
    } catch (e: any) {
      Alert.alert('Scheduling Error', 'Could not schedule swap request.');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Swap Scheduler</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.introText, { color: theme.colors.textSecondary }]}>
          Coordinate your skill swap session with <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{partnerName}</Text>
        </Text>

        {/* Skill coordinates */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Choose Skill You Offer</Text>
        <View style={styles.pickerRow}>
          {offeredSkills.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.presetBtn,
                {
                  backgroundColor: selectedOffer === s ? theme.colors.success + '15' : theme.colors.surface,
                  borderColor: selectedOffer === s ? theme.colors.success : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedOffer(s)}
            >
              <Text style={{ color: selectedOffer === s ? theme.colors.success : theme.colors.text, fontWeight: '600' }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField
          label={`What skill do you want from ${partnerName}?`}
          placeholder="e.g. UI/UX Design, Figma"
          value={wantedSkill}
          onChangeText={setWantedSkill}
        />

        {/* Date Proposal */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Proposed Date (YYYY-MM-DD)</Text>
        <InputField
          label="Date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
        <View style={styles.presetRow}>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetDate(1)}>
            <Text style={{ color: theme.colors.text }}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetDate(2)}>
            <Text style={{ color: theme.colors.text }}>In 2 days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetDate(7)}>
            <Text style={{ color: theme.colors.text }}>Next week</Text>
          </TouchableOpacity>
        </View>

        {/* Time Proposal */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 16 }]}>Proposed Time (HH:MM)</Text>
        <InputField
          label="Time"
          placeholder="e.g. 14:30, 09:00"
          value={time}
          onChangeText={setTime}
        />
        <View style={styles.presetRow}>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetTime('10:00')}>
            <Text style={{ color: theme.colors.text }}>10:00 AM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetTime('14:00')}>
            <Text style={{ color: theme.colors.text }}>02:00 PM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.presetBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => handleSelectPresetTime('18:30')}>
            <Text style={{ color: theme.colors.text }}>06:30 PM</Text>
          </TouchableOpacity>
        </View>

        {/* Session objectives */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 16 }]}>Session Notes / Agenda</Text>
        <TextInput
          style={[
            styles.notesInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          multiline
          numberOfLines={4}
          placeholder="What would you like to achieve in this session? (e.g. 'Build a React Native screen together')"
          placeholderTextColor={theme.colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
        />

        {/* Reminders setting */}
        <View style={[styles.switchRow, { borderColor: theme.colors.border }]}>
          <View>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>Push Reminders</Text>
            <Text style={[styles.switchSub, { color: theme.colors.textSecondary }]}>Send push notification alerts prior to session</Text>
          </View>
          <Switch
            value={reminders}
            onValueChange={setReminders}
            trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
            thumbColor={reminders ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <CustomButton
          title="Send Swap Proposal"
          onPress={handleScheduleSubmit}
          loading={scheduling}
          containerStyle={{ marginTop: 24, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    marginTop: -8,
  },
  presetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  notesInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 80,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
