import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME, INITIAL_SKILLS } from '../constants/theme';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skillsOffered, setSkillsOffered] = useState<string[]>(currentUser?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(currentUser?.skillsWanted || []);
  const [certificates, setCertificates] = useState<string[]>(currentUser?.certificates || []);
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '');

  const [newCertificate, setNewCertificate] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        try {
          setSaving(true);
          const downloadUrl = await storageService.uploadProfileImage(currentUser?.uid || 'currentUser', uri);
          setProfileImage(downloadUrl);
          Alert.alert('Success', 'Profile photo uploaded successfully!');
        } catch (e: any) {
          Alert.alert('Error', 'Failed to upload image.');
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const handleToggleSkill = (skill: string, type: 'offered' | 'wanted') => {
    const targetList = type === 'offered' ? skillsOffered : skillsWanted;
    const setter = type === 'offered' ? setSkillsOffered : setSkillsWanted;

    if (targetList.includes(skill)) {
      setter(targetList.filter((s) => s !== skill));
    } else {
      setter([...targetList, skill]);
    }
  };

  const handleAddCertificate = () => {
    if (!newCertificate.trim()) return;
    setCertificates([...certificates, newCertificate.trim()]);
    setNewCertificate('');
  };

  const handleRemoveCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert('Validation Error', 'Full Name and Username cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      const updates = {
        fullName,
        username,
        bio,
        skillsOffered,
        skillsWanted,
        certificates,
        profileImage,
      };

      await dbService.updateUserProfile(currentUser?.uid || 'currentUser', updates);
      Alert.alert('Profile Saved', 'Your profile details have been successfully updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', 'Could not save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Editor */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
            <Image
              source={{ uri: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }}
              style={styles.avatar}
            />
            <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
              <Icon name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.avatarTip, { color: theme.colors.textSecondary }]}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Core details */}
        <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
        <InputField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Bio</Text>
        <TextInput
          style={[
            styles.bioInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          multiline
          numberOfLines={4}
          placeholder="Tell other swappers about yourself, your background, and goals..."
          placeholderTextColor={theme.colors.textSecondary}
          value={bio}
          onChangeText={setBio}
        />

        {/* Skills Offered Selector */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>Skills Offered</Text>
        <View style={styles.chipContainer}>
          {INITIAL_SKILLS.map((skill) => {
            const selected = skillsOffered.includes(skill);
            return (
              <TouchableOpacity
                key={`offered-${skill}`}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.colors.success + '15' : theme.colors.surface,
                    borderColor: selected ? theme.colors.success : theme.colors.border,
                  },
                ]}
                onPress={() => handleToggleSkill(skill, 'offered')}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: selected ? theme.colors.success : theme.colors.text, fontWeight: selected ? '700' : '500' },
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Skills Wanted Selector */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>Skills Wanted</Text>
        <View style={styles.chipContainer}>
          {INITIAL_SKILLS.map((skill) => {
            const selected = skillsWanted.includes(skill);
            return (
              <TouchableOpacity
                key={`wanted-${skill}`}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.colors.primary + '15' : theme.colors.surface,
                    borderColor: selected ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => handleToggleSkill(skill, 'wanted')}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: selected ? theme.colors.primary : theme.colors.text, fontWeight: selected ? '700' : '500' },
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Certificates Setup */}
        <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>Certificates</Text>
        <View style={styles.certInputRow}>
          <TextInput
            style={[
              styles.certInput,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            placeholder="Add certificate/credentials (e.g. AWS Certified)"
            placeholderTextColor={theme.colors.textSecondary}
            value={newCertificate}
            onChangeText={setNewCertificate}
          />
          <TouchableOpacity
            style={[styles.addCertBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleAddCertificate}
          >
            <Icon name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Certificates List */}
        {certificates.map((cert, index) => (
          <View key={`cert-${index}`} style={[styles.certRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Icon name="certificate" size={20} color={theme.colors.warning} style={{ marginRight: 10 }} />
            <Text style={[styles.certText, { color: theme.colors.text }]}>{cert}</Text>
            <TouchableOpacity onPress={() => handleRemoveCertificate(index)}>
              <Icon name="trash-can-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        <CustomButton
          title="Save Profile"
          onPress={handleSave}
          loading={saving}
          containerStyle={{ marginTop: 32, marginBottom: 40 }}
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
    elevation: 2,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarTip: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  bioInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 90,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  certInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  certInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
  },
  addCertBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  certText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
});
