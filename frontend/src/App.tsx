import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WeddingInvitation from './components/WeddingInvitation';
import MyInvitationsPage from './pages/MyInvitationsPage';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/invitacion/:id" element={<WeddingInvitation />} />
        <Route path="/guest-management" element={<MyInvitationsPage />} />
        <Route path="*" element={<Navigate to="/invitacion/boda-elegante" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
