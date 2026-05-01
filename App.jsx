import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import POS from './pages/POS';
import Tables from './pages/Tables';
import Kitchen from './pages/Kitchen';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/pos" replace />} />
          <Route path="pos" element={<POS />} />
          <Route path="tables" element={<Tables />} />
          <Route path="kitchen" element={<Kitchen />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
