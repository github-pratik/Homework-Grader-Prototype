import React, { useState, createElement } from 'react';
import { useGrader } from '../context/GraderContext';
import { DownloadIcon, BarChart3Icon } from 'lucide-react';
const Analysis: React.FC = () => {
  const {
    assignments,
    submissions,
    gradedSubmissions,
    getSubmissionsByAssignmentId,
    getGradedSubmissionsByAssignmentId
  } = useGrader();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments.length > 0 ? assignments[0].id : '');
  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);
  const assignmentSubmissions = selectedAssignmentId ? getSubmissionsByAssignmentId(selectedAssignmentId) : [];
  const assignmentGradedSubmissions = selectedAssignmentId ? getGradedSubmissionsByAssignmentId(selectedAssignmentId) : [];
  // Calculate statistics
  const totalSubmissions = assignmentSubmissions.length;
  const totalGraded = assignmentGradedSubmissions.length;
  const completionRate = totalSubmissions > 0 ? Math.round(totalGraded / totalSubmissions * 100) : 0;
  // Calculate average scores
  const averageScore = assignmentGradedSubmissions.length > 0 ? Math.round(assignmentGradedSubmissions.reduce((sum, gs) => sum + gs.totalPoints, 0) / assignmentGradedSubmissions.length) : 0;
  // Calculate criterion averages
  const criterionAverages = selectedAssignment ? selectedAssignment.criteria.map(criterion => {
    const total = assignmentGradedSubmissions.reduce((sum, gs) => {
      const criterionGrade = gs.grades.find(g => g.criterionId === criterion.id);
      return sum + (criterionGrade ? criterionGrade.points : 0);
    }, 0);
    const average = assignmentGradedSubmissions.length > 0 ? total / assignmentGradedSubmissions.length : 0;
    const percentage = criterion.maxPoints > 0 ? average / criterion.maxPoints * 100 : 0;
    return {
      id: criterion.id,
      name: criterion.name,
      average,
      maxPoints: criterion.maxPoints,
      percentage
    };
  }) : [];
  // Calculate grade distribution
  const gradeDistribution = {
    'A (90-100%)': 0,
    'B (80-89%)': 0,
    'C (70-79%)': 0,
    'D (60-69%)': 0,
    'F (0-59%)': 0
  };
  if (selectedAssignment) {
    assignmentGradedSubmissions.forEach(gs => {
      const percentage = gs.totalPoints / selectedAssignment.totalPoints * 100;
      if (percentage >= 90) gradeDistribution['A (90-100%)']++;else if (percentage >= 80) gradeDistribution['B (80-89%)']++;else if (percentage >= 70) gradeDistribution['C (70-79%)']++;else if (percentage >= 60) gradeDistribution['D (60-69%)']++;else gradeDistribution['F (0-59%)']++;
    });
  }
  // Export data as CSV
  const exportCSV = () => {
    if (!selectedAssignment || assignmentGradedSubmissions.length === 0) return;
    // Create header row
    let csvContent = 'Student ID,Student Name,Submission Date,Total Points';
    // Add criterion names to header
    selectedAssignment.criteria.forEach(criterion => {
      csvContent += `,${criterion.name} (${criterion.maxPoints} pts)`;
    });
    csvContent += ',Overall Feedback\n';
    // Add data rows
    assignmentGradedSubmissions.forEach(gs => {
      const submission = submissions.find(s => s.id === gs.submissionId);
      if (!submission) return;
      csvContent += `${submission.studentId},${submission.studentName},${submission.submissionDate},${gs.totalPoints}`;
      // Add criterion grades
      selectedAssignment.criteria.forEach(criterion => {
        const grade = gs.grades.find(g => g.criterionId === criterion.id);
        csvContent += `,${grade ? grade.points : 0}`;
      });
      // Add overall feedback (escape any commas)
      csvContent += `,${gs.overallFeedback.replace(/,/g, ';')}\n`;
    });
    // Create and trigger download
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${selectedAssignment.title.replace(/\s+/g, '_')}_grades.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analyze grading results and generate insights on student performance
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-1">
            Select Assignment for Analysis
          </label>
          <select id="assignment" value={selectedAssignmentId} onChange={e => setSelectedAssignmentId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- Select an assignment --</option>
            {assignments.map(assignment => <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>)}
          </select>
        </div>
        {selectedAssignment && <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm text-blue-600 mb-1">
                  Completion Rate
                </div>
                <div className="text-3xl font-bold">{completionRate}%</div>
                <div className="text-sm text-gray-500 mt-1">
                  {totalGraded} of {totalSubmissions} graded
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-sm text-green-600 mb-1">Average Score</div>
                <div className="text-3xl font-bold">{averageScore}%</div>
                <div className="text-sm text-gray-500 mt-1">
                  out of {selectedAssignment.totalPoints} points
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-sm text-purple-600 mb-1">
                  Highest Criterion
                </div>
                <div className="text-3xl font-bold">
                  {criterionAverages.length > 0 ? `${criterionAverages.reduce((prev, current) => prev.percentage > current.percentage ? prev : current).name}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  best performance area
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Criterion Performance
                </h2>
                {assignmentGradedSubmissions.length > 0 && <button onClick={exportCSV} className="flex items-center text-blue-600 hover:text-blue-800">
                    <DownloadIcon size={16} className="mr-1" /> Export CSV
                  </button>}
              </div>
              {criterionAverages.length > 0 ? <div className="space-y-4">
                  {criterionAverages.map(criterion => <div key={criterion.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {criterion.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.round(criterion.average * 10) / 10} /{' '}
                          {criterion.maxPoints}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{
                  width: `${criterion.percentage}%`
                }}></div>
                      </div>
                    </div>)}
                </div> : <p className="text-gray-500">No graded submissions yet.</p>}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Grade Distribution
              </h2>
              {assignmentGradedSubmissions.length > 0 ? <div className="grid grid-cols-5 gap-2">
                  {Object.entries(gradeDistribution).map(([grade, count]) => <div key={grade} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold">
                        {grade.split(' ')[0]}
                      </div>
                      <div className="text-3xl font-bold mb-1">{count}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round(count / assignmentGradedSubmissions.length * 100)}
                        %
                      </div>
                    </div>)}
                </div> : <p className="text-gray-500">No graded submissions yet.</p>}
            </div>
            {assignmentGradedSubmissions.length > 0 && <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Individual Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left">Student</th>
                        <th className="py-2 px-4 text-left">ID</th>
                        <th className="py-2 px-4 text-left">Score</th>
                        <th className="py-2 px-4 text-left">Percentage</th>
                        <th className="py-2 px-4 text-left">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentGradedSubmissions.map(gs => {
                  const submission = submissions.find(s => s.id === gs.submissionId);
                  if (!submission) return null;
                  const percentage = Math.round(gs.totalPoints / selectedAssignment.totalPoints * 100);
                  let letterGrade = 'F';
                  if (percentage >= 90) letterGrade = 'A';else if (percentage >= 80) letterGrade = 'B';else if (percentage >= 70) letterGrade = 'C';else if (percentage >= 60) letterGrade = 'D';
                  return <tr key={gs.submissionId} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4">
                              {submission.studentName}
                            </td>
                            <td className="py-2 px-4">
                              {submission.studentId}
                            </td>
                            <td className="py-2 px-4">
                              {gs.totalPoints} /{' '}
                              {selectedAssignment.totalPoints}
                            </td>
                            <td className="py-2 px-4">{percentage}%</td>
                            <td className="py-2 px-4">{letterGrade}</td>
                          </tr>;
                })}
                    </tbody>
                  </table>
                </div>
              </div>}
          </>}
      </div>
    </div>;
};
export default Analysis;