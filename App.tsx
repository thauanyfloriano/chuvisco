import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Editor from './pages/Editor';
import ReadingView from './pages/ReadingView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/read" element={<ReadingView />} />
      </Routes>
    </Router>
  );
};

export default App;