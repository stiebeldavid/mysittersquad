import { Babysitter } from "@/types/babysitter";

export const mapBabysitterFields = (
  firstName: string,
  lastName: string | undefined,
  formattedMobile: string,
  formattedParentMobile: string,
  age?: string,
  grade?: string,
  rate?: string,
  specialties?: string,
  notes?: string,
  email?: string
) => ({
  'First Name': firstName,
  'Last Name': lastName || '',
  'Mobile': formattedMobile,
  'Parent Owner Mobile': formattedParentMobile,
  'Age': age || '',
  'Grade': grade || '',
  'Hourly rate (USD)': rate || '',
  'Specialties': specialties || '',
  'Notes': notes || '',
  'Email': email || '',
  'Deleted': false,
});

export const mapToBabysitter = (record: any): Babysitter => ({
  id: record.id,
  firstName: record.get('First Name') as string,
  lastName: record.get('Last Name') as string,
  mobile: record.get('Mobile') as string,
  age: record.get('Age') as string,
  grade: record.get('Grade') as string,
  rate: record.get('Hourly rate (USD)') as string,
  specialties: record.get('Specialties') as string,
  notes: record.get('Notes') as string,
  email: record.get('Email') as string,
});