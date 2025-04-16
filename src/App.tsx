import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GraderProvider } from './context/GraderContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateAssignment from './pages/CreateAssignment';
import GradeSubmissions from './pages/GradeSubmissions';
import Analysis from './pages/Analysis';
export function App() {
  return <Router>
      <GraderProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateAssignment />} />
            <Route path="/grade" element={<GradeSubmissions />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </Layout>
      </GraderProvider>
    </Router>;
}