import React from 'react';
import { Link } from 'react-router-dom';
import { useGrader } from '../context/GraderContext';
import { PlusSquareIcon, CheckSquareIcon, BarChartIcon } from 'lucide-react';
const Dashboard: React.FC = () => {
  const {
    assignments,
    submissions,
    gradedSubmissions
  } = useGrader();
  // Calculate statistics
  const totalAssignments = assignments.length;
  const totalSubmissions = submissions.length;
  const totalGraded = gradedSubmissions.length;
  const pendingGrading = totalSubmissions - totalGraded;
  // Calculate average score
  const averageScore = gradedSubmissions.length > 0 ? Math.round(gradedSubmissions.reduce((sum, gs) => sum + gs.totalPoints, 0) / gradedSubmissions.length) : 0;
  const StatCard: React.FC<{
    title: string;
    value: number | string;
    color: string;
  }> = ({
    title,
    value,
    color
  }) => <div className={`${color} rounded-lg shadow-md p-6`}>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>;
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Homework Grader Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Assignments" value={totalAssignments} color="bg-blue-100" />
        <StatCard title="Total Submissions" value={totalSubmissions} color="bg-green-100" />
        <StatCard title="Pending Grading" value={pendingGrading} color="bg-yellow-100" />
        <StatCard title="Average Score" value={`${averageScore}%`} color="bg-purple-100" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <PlusSquareIcon size={24} className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Create Assignment
            </h2>
          </div>
          <p className="text-gray-600">
            Define new homework assignments and set up grading criteria.
          </p>
        </Link>
        <Link to="/grade" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <CheckSquareIcon size={24} className="text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Grade Submissions
            </h2>
          </div>
          <p className="text-gray-600">
            Review and grade student submissions based on defined criteria.
          </p>
        </Link>
        <Link to="/analysis" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <BarChartIcon size={24} className="text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              View Analysis
            </h2>
          </div>
          <p className="text-gray-600">
            Analyze grading results and generate insights on student
            performance.
          </p>
        </Link>
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Assignments
        </h2>
        {assignments.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Due Date</th>
                  <th className="py-2 px-4 text-left">Submissions</th>
                  <th className="py-2 px-4 text-left">Graded</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => {
              const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id).length;
              const assignmentGraded = gradedSubmissions.filter(gs => {
                const sub = submissions.find(s => s.id === gs.submissionId);
                return sub && sub.assignmentId === assignment.id;
              }).length;
              return <tr key={assignment.id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{assignment.title}</td>
                      <td className="py-2 px-4">{assignment.dueDate}</td>
                      <td className="py-2 px-4">{assignmentSubmissions}</td>
                      <td className="py-2 px-4">
                        {assignmentGraded} / {assignmentSubmissions}
                      </td>
                    </tr>;
            })}
              </tbody>
            </table>
          </div> : <p className="text-gray-500">No assignments created yet.</p>}
      </div>
    </div>;
};
export default Dashboard;