export interface Request {
  id: string;
  requestDate: string;
  timeRange: string;
  babysitterId: string;
  babysitterName: string;
  status: string;
  createdAt: string;
  babysitterDeleted?: boolean;
  additionalNotes?: string;
}

export interface Parent {
  firstName: string;
  lastName: string;
}

export interface RequestDetails {
  id: string;
  requestDate: string;
  timeRange: string;
  additionalNotes: string;
  babysitterFirstName: string;
  parent: Parent | null;
  verificationId: string;
}