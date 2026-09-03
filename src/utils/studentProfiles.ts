import { StudentProfile, UserProgress } from '../types';
import { getStoredUserProgress, INITIAL_USER_PROGRESS } from './telemetry';

const PROFILES_STORAGE_KEY = 'marathi_typing_students_v1';
const ACTIVE_PROFILE_KEY = 'marathi_typing_active_student_id';

export function getStoredProfiles(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored student profiles:', e);
  }

  // Create initial default profile using existing local progress
  const defaultProf: StudentProfile = {
    id: 'default-student-1',
    name: 'विद्यार्थी १ (Student 1)',
    batchOrRoll: 'नियमित तुकडी (Regular)',
    targetSpeed: 30,
    createdAt: new Date().toISOString(),
    progress: getStoredUserProgress()
  };

  saveStoredProfiles([defaultProf]);
  setActiveProfileId(defaultProf.id);
  return [defaultProf];
}

export function saveStoredProfiles(profiles: StudentProfile[]): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save student profiles:', e);
  }
}

export function getActiveProfileId(): string {
  const stored = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (stored) return stored;
  const profiles = getStoredProfiles();
  return profiles[0]?.id || 'default-student-1';
}

export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch (e) {
    console.error('Failed to set active profile id:', e);
  }
}

export function getActiveProfile(): StudentProfile {
  const profiles = getStoredProfiles();
  const activeId = getActiveProfileId();
  const found = profiles.find(p => p.id === activeId);
  return found || profiles[0];
}

export function createStudentProfile(name: string, batchOrRoll: string, targetSpeed: 30 | 40): StudentProfile {
  const profiles = getStoredProfiles();
  const newProfile: StudentProfile = {
    id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim() || 'नवीन विद्यार्थी',
    batchOrRoll: batchOrRoll.trim() || 'तुकडी अ',
    targetSpeed,
    createdAt: new Date().toISOString(),
    progress: { ...INITIAL_USER_PROGRESS }
  };

  profiles.push(newProfile);
  saveStoredProfiles(profiles);
  setActiveProfileId(newProfile.id);
  return newProfile;
}

export function deleteStudentProfile(id: string): StudentProfile[] {
  const profiles = getStoredProfiles();
  if (profiles.length <= 1) {
    return profiles; // Do not delete the last remaining profile
  }
  const filtered = profiles.filter(p => p.id !== id);
  saveStoredProfiles(filtered);
  if (getActiveProfileId() === id) {
    setActiveProfileId(filtered[0].id);
  }
  return filtered;
}

export function updateActiveProfileProgress(progress: UserProgress): void {
  const profiles = getStoredProfiles();
  const activeId = getActiveProfileId();
  const idx = profiles.findIndex(p => p.id === activeId);
  if (idx !== -1) {
    profiles[idx].progress = progress;
    saveStoredProfiles(profiles);
  }
}

export function exportProfilesBackup(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profiles: getStoredProfiles(),
    activeProfileId: getActiveProfileId()
  };
  return JSON.stringify(data, null, 2);
}

export function importProfilesBackup(jsonContent: string): boolean {
  try {
    const parsed = JSON.parse(jsonContent);
    if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      saveStoredProfiles(parsed.profiles);
      if (parsed.activeProfileId) {
        setActiveProfileId(parsed.activeProfileId);
      } else {
        setActiveProfileId(parsed.profiles[0].id);
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to import student profiles backup:', e);
  }
  return false;
}
