import React, { useState } from 'react';
import { useGrader } from '../context/GraderContext';
import { CheckCircleIcon } from 'lucide-react';
const GradeSubmissions: React.FC = () => {
  const {
    assignments,
    submissions,
    gradedSubmissions,
    getSubmissionsByAssignmentId,
    getAssignmentById,
    gradeSubmission
  } = useGrader();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments.length > 0 ? assignments[0].id : '');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');
  const [grades, setGrades] = useState<{
    [criterionId: string]: number;
  }>({});
  const [feedback, setFeedback] = useState<{
    [criterionId: string]: string;
  }>({});
  const [overallFeedback, setOverallFeedback] = useState('');
  const selectedAssignment = selectedAssignmentId ? getAssignmentById(selectedAssignmentId) : undefined;
  const assignmentSubmissions = selectedAssignmentId ? getSubmissionsByAssignmentId(selectedAssignmentId) : [];
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId);
  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssignmentId = e.target.value;
    setSelectedAssignmentId(newAssignmentId);
    setSelectedSubmissionId('');
    resetGradingForm();
  };
  const handleSubmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubmissionId = e.target.value;
    setSelectedSubmissionId(newSubmissionId);
    // Check if this submission has already been graded
    const existingGrade = gradedSubmissions.find(gs => gs.submissionId === newSubmissionId);
    if (existingGrade) {
      // Pre-populate the form with existing grades
      const gradesObj: {
        [criterionId: string]: number;
      } = {};
      const feedbackObj: {
        [criterionId: string]: string;
      } = {};
      existingGrade.grades.forEach(grade => {
        gradesObj[grade.criterionId] = grade.points;
        feedbackObj[grade.criterionId] = grade.feedback;
      });
      setGrades(gradesObj);
      setFeedback(feedbackObj);
      setOverallFeedback(existingGrade.overallFeedback);
    } else {
      resetGradingForm();
    }
  };
  const resetGradingForm = () => {
    setGrades({});
    setFeedback({});
    setOverallFeedback('');
  };
  const handleGradeChange = (criterionId: string, points: number) => {
    setGrades({
      ...grades,
      [criterionId]: points
    });
  };
  const handleFeedbackChange = (criterionId: string, text: string) => {
    setFeedback({
      ...feedback,
      [criterionId]: text
    });
  };
  const calculateTotalPoints = () => {
    if (!selectedAssignment) return 0;
    return selectedAssignment.criteria.reduce((total, criterion) => {
      return total + (grades[criterion.id] || 0);
    }, 0);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !selectedAssignment) return;
    const criteriaGrades = selectedAssignment.criteria.map(criterion => ({
      criterionId: criterion.id,
      points: grades[criterion.id] || 0,
      feedback: feedback[criterion.id] || ''
    }));
    const newGradedSubmission = {
      submissionId: selectedSubmission.id,
      grades: criteriaGrades,
      totalPoints: calculateTotalPoints(),
      overallFeedback,
      gradedDate: new Date().toISOString().split('T')[0]
    };
    gradeSubmission(newGradedSubmission);
    alert('Submission graded successfully!');
  };
  const isSubmissionGraded = (submissionId: string) => {
    return gradedSubmissions.some(gs => gs.submissionId === submissionId);
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Grade Submissions</h1>
        <p className="text-gray-600 mt-2">
          Review and grade student submissions based on defined criteria
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-1">
              Select Assignment
            </label>
            <select id="assignment" value={selectedAssignmentId} onChange={handleAssignmentChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">-- Select an assignment --</option>
              {assignments.map(assignment => <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>)}
            </select>
          </div>
          <div>
            <label htmlFor="submission" className="block text-sm font-medium text-gray-700 mb-1">
              Select Submission
            </label>
            <select id="submission" value={selectedSubmissionId} onChange={handleSubmissionChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={!selectedAssignmentId}>
              <option value="">-- Select a submission --</option>
              {assignmentSubmissions.map(submission => <option key={submission.id} value={submission.id}>
                  {submission.studentName} ({submission.studentId})
                  {isSubmissionGraded(submission.id) && ' ✓'}
                </option>)}
            </select>
          </div>
        </div>
        {selectedSubmission && selectedAssignment && <div className="border-t pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Submission Details
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">
                    {selectedSubmission.studentName} (
                    {selectedSubmission.studentId})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">
                    {selectedSubmission.submissionDate}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Submission Content</p>
                  <p className="font-medium break-words">
                    {selectedSubmission.content}
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Grading Criteria
                </h3>
                <div className="space-y-6">
                  {selectedAssignment.criteria.map(criterion => <div key={criterion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-800">
                          {criterion.name}
                        </h4>
                        <div className="text-sm text-gray-600">
                          {grades[criterion.id] || 0} / {criterion.maxPoints}{' '}
                          points
                        </div>
                      </div>
                      <div className="mb-4">
                        <input type="range" min="0" max={criterion.maxPoints} value={grades[criterion.id] || 0} onChange={e => handleGradeChange(criterion.id, parseInt(e.target.value))} className="w-full" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>{criterion.maxPoints}</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`feedback-${criterion.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback
                        </label>
                        <textarea id={`feedback-${criterion.id}`} value={feedback[criterion.id] || ''} onChange={e => handleFeedbackChange(criterion.id, e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Provide feedback for this criterion" />
                      </div>
                    </div>)}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="overall-feedback" className="block text-lg font-medium text-gray-800">
                    Overall Feedback
                  </label>
                  <div className="text-lg font-semibold">
                    Total: {calculateTotalPoints()} /{' '}
                    {selectedAssignment.totalPoints} points
                  </div>
                </div>
                <textarea id="overall-feedback" value={overallFeedback} onChange={e => setOverallFeedback(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Provide overall feedback on the submission" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <CheckCircleIcon size={20} className="mr-2" />
                  Submit Grade
                </button>
              </div>
            </form>
          </div>}
      </div>
    </div>;
};
export default GradeSubmissions;