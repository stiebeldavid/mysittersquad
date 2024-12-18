export interface Request {
  id: string;
  requestDate: string;
  timeRange: string;
  babysitterId: string;
  babysitterFirstName: string;
  babysitterLastName: string;
  status: string;
  createdAt: string;
  babysitterDeleted?: boolean;
  additionalNotes?: string;
  requestGroupId: string;
}

export interface Parent {
  firstName: string;
  lastName: string;
}

export interface RequestDetails {
  id: string;
  requestDate: string;
  timeRange: string;
  notes?: string;
  date: string;
  babysitterFirstName: string;
  parent: Parent | null;
  verificationId: string;
}