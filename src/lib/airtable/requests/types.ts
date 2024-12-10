export interface Request {
  id: string;
  date: string;
  timeRange: string;
  babysitterId: string;
  babysitterName: string;
  status: string;
  createdAt: string;
  babysitterDeleted?: boolean;
  notes?: string;
}

export interface Parent {
  firstName: string;
  lastName: string;
}

export interface RequestDetails {
  id: string;
  date: string;
  timeRange: string;
  notes: string;
  babysitterFirstName: string;
  parent: Parent | null;
  verificationId: string;
}