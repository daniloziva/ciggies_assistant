import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InvoiceListPage } from './pages/InvoiceListPage';
import { InvoiceCardPage } from './pages/InvoiceCardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceListPage />} />
        <Route path="/invoices/:Id" element={<InvoiceCardPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;