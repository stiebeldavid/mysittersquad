import { create } from 'zustand';
import { Kid } from '@/types/kid';
import { EmergencyContact } from '@/types/emergency-contact';
import { Babysitter } from '@/types/babysitter';

interface FamilyState {
  address: string;
  kids: Kid[];
  emergencyContacts: EmergencyContact[];
  babysitters: Babysitter[];
  setAddress: (address: string) => void;
  setKids: (kids: Kid[]) => void;
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  setBabysitters: (babysitters: Babysitter[]) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  address: '',
  kids: [],
  emergencyContacts: [],
  babysitters: [],
  setAddress: (address) => set({ address }),
  setKids: (kids) => set({ kids }),
  setEmergencyContacts: (contacts) => set({ emergencyContacts: contacts }),
  setBabysitters: (babysitters) => set({ babysitters }),
}));