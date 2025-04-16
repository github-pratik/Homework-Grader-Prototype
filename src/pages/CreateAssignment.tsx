import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrader } from '../context/GraderContext';
import { PlusIcon, TrashIcon } from 'lucide-react';
const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const {
    addAssignment
  } = useGrader();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [criteria, setCriteria] = useState([{
    id: `c-${Date.now()}-1`,
    name: 'Content Quality',
    maxPoints: 25
  }, {
    id: `c-${Date.now()}-2`,
    name: 'Organization',
    maxPoints: 25
  }, {
    id: `c-${Date.now()}-3`,
    name: 'Presentation',
    maxPoints: 25
  }, {
    id: `c-${Date.now()}-4`,
    name: 'Creativity',
    maxPoints: 25
  }]);
  const addCriterion = () => {
    setCriteria([...criteria, {
      id: `c-${Date.now()}`,
      name: '',
      maxPoints: 10
    }]);
  };
  const updateCriterion = (id: string, field: 'name' | 'maxPoints', value: string | number) => {
    setCriteria(criteria.map(c => c.id === id ? {
      ...c,
      [field]: value
    } : c));
  };
  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };
  const calculateTotalPoints = () => {
    return criteria.reduce((sum, criterion) => sum + Number(criterion.maxPoints), 0);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment = {
      id: `a-${Date.now()}`,
      title,
      description,
      criteria,
      totalPoints: calculateTotalPoints(),
      dueDate
    };
    addAssignment(newAssignment);
    navigate('/');
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Assignment</h1>
        <p className="text-gray-600 mt-2">
          Define a new homework assignment and set up grading criteria
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title
            </label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Grading Criteria
              </h3>
              <div className="text-sm text-gray-600">
                Total Points: {calculateTotalPoints()}
              </div>
            </div>
            <div className="space-y-4">
              {criteria.map(criterion => <div key={criterion.id} className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <input type="text" value={criterion.name} onChange={e => updateCriterion(criterion.id, 'name', e.target.value)} placeholder="Criterion name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div className="w-24">
                    <input type="number" value={criterion.maxPoints} onChange={e => updateCriterion(criterion.id, 'maxPoints', parseInt(e.target.value) || 0)} min="1" max="100" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <button type="button" onClick={() => removeCriterion(criterion.id)} className="p-2 text-red-500 hover:text-red-700" disabled={criteria.length <= 1}>
                    <TrashIcon size={20} />
                  </button>
                </div>)}
            </div>
            <button type="button" onClick={addCriterion} className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
              <PlusIcon size={16} className="mr-1" /> Add Criterion
            </button>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default CreateAssignment;