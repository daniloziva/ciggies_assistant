import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InvoiceListPage } from './pages/InvoiceListPage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceListPage />} />
        <Route path="/invoices/:Id" element={<InvoiceDetailPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;