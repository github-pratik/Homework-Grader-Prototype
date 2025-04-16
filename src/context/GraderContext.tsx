import React, { useState, createContext, useContext, Component } from 'react';
import { Assignment, Submission, GradedSubmission } from '../types';
interface GraderContextType {
  assignments: Assignment[];
  submissions: Submission[];
  gradedSubmissions: GradedSubmission[];
  addAssignment: (assignment: Assignment) => void;
  addSubmission: (submission: Submission) => void;
  gradeSubmission: (gradedSubmission: GradedSubmission) => void;
  getAssignmentById: (id: string) => Assignment | undefined;
  getSubmissionsByAssignmentId: (assignmentId: string) => Submission[];
  getGradedSubmissionsByAssignmentId: (assignmentId: string) => GradedSubmission[];
}
const GraderContext = createContext<GraderContextType | undefined>(undefined);
export const GraderProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([{
    id: '1',
    title: 'React Component Design',
    description: 'Create a reusable React component with proper props and documentation',
    criteria: [{
      id: 'c1',
      name: 'Code Quality',
      maxPoints: 25
    }, {
      id: 'c2',
      name: 'Documentation',
      maxPoints: 25
    }, {
      id: 'c3',
      name: 'Design Patterns',
      maxPoints: 25
    }, {
      id: 'c4',
      name: 'Reusability',
      maxPoints: 25
    }],
    totalPoints: 100,
    dueDate: '2023-12-15'
  }]);
  const [submissions, setSubmissions] = useState<Submission[]>([{
    id: 's1',
    assignmentId: '1',
    studentName: 'John Doe',
    studentId: '12345',
    submissionDate: '2023-12-10',
    content: 'https://github.com/johndoe/react-component'
  }, {
    id: 's2',
    assignmentId: '1',
    studentName: 'Jane Smith',
    studentId: '67890',
    submissionDate: '2023-12-12',
    content: 'https://github.com/janesmith/react-component'
  }]);
  const [gradedSubmissions, setGradedSubmissions] = useState<GradedSubmission[]>([]);
  const addAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };
  const addSubmission = (submission: Submission) => {
    setSubmissions([...submissions, submission]);
  };
  const gradeSubmission = (gradedSubmission: GradedSubmission) => {
    const exists = gradedSubmissions.some(gs => gs.submissionId === gradedSubmission.submissionId);
    if (exists) {
      setGradedSubmissions(gradedSubmissions.map(gs => gs.submissionId === gradedSubmission.submissionId ? gradedSubmission : gs));
    } else {
      setGradedSubmissions([...gradedSubmissions, gradedSubmission]);
    }
  };
  const getAssignmentById = (id: string) => {
    return assignments.find(assignment => assignment.id === id);
  };
  const getSubmissionsByAssignmentId = (assignmentId: string) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };
  const getGradedSubmissionsByAssignmentId = (assignmentId: string) => {
    return gradedSubmissions.filter(gs => {
      const submission = submissions.find(s => s.id === gs.submissionId);
      return submission && submission.assignmentId === assignmentId;
    });
  };
  return <GraderContext.Provider value={{
    assignments,
    submissions,
    gradedSubmissions,
    addAssignment,
    addSubmission,
    gradeSubmission,
    getAssignmentById,
    getSubmissionsByAssignmentId,
    getGradedSubmissionsByAssignmentId
  }}>
      {children}
    </GraderContext.Provider>;
};
export const useGrader = () => {
  const context = useContext(GraderContext);
  if (context === undefined) {
    throw new Error('useGrader must be used within a GraderProvider');
  }
  return context;
};