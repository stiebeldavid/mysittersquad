export interface Request {
  id: string;
  requestDate: string;
  timeRange: string;
  babysitterId: string;
  "First Name (from Babysitter)": string;
  "Last Name (from Babysitter)": string;
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

export interface GroupedRequest {
  requestDate: string;
  timeRange: string;
  createdAt: string;
  additionalNotes?: string;
  babysitters: {
    id: string;
    name: string;
    status: string;
    deleted?: boolean;
  }[];
}