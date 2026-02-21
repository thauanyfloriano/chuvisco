import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Editor from './pages/Editor';
import ReadingView from './pages/ReadingView';
import PublicSubmission from './pages/SubmitPoem';
import Settings from './pages/Settings';
import About from './pages/About';
import { Toaster } from "./components/ui/toaster"

import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/submit" element={<PublicSubmission />} />
        <Route path="/read/:id" element={<ReadingView />} />
      </Routes>
      <Toaster />
    </Router>
  );
};


export default App;