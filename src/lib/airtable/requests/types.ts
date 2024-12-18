export interface Request {
  id: string;
  "Request Date": string;
  "Time Range": string;
  "Babysitter ID": string;
  "First Name (from Babysitter)": string;
  "Last Name (from Babysitter)": string;
  "Status": string;
  "Created At": string;
  "Babysitter Deleted"?: boolean;
  "Additional Notes"?: string;
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