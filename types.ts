
export interface ReportData {
  moduleTitle: string;
  sessionNumber: string;
  keyPoints: string[];
}

export interface GeneratedReport {
  title: string;
  body: string;
}

export interface DocxData {
  fullName: string;
  rentalNumber: string;
  location: string;
  date: string;
  title: string;
  body: string;
}
