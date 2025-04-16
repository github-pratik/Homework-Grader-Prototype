export interface Criterion {
  id: string;
  name: string;
  maxPoints: number;
}
export interface Assignment {
  id: string;
  title: string;
  description: string;
  criteria: Criterion[];
  totalPoints: number;
  dueDate: string;
}
export interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentId: string;
  submissionDate: string;
  content: string;
}
export interface CriterionGrade {
  criterionId: string;
  points: number;
  feedback: string;
}
export interface GradedSubmission {
  submissionId: string;
  grades: CriterionGrade[];
  totalPoints: number;
  overallFeedback: string;
  gradedDate: string;
}