import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import AdminLayout from './admin/AdminLayout';
import AdminRoles from './admin/AdminRoles';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminJersey from './admin/AdminJersey';
import AdminJerseyEdit from './admin/AdminJerseyEdit';
import AdminJerseyRemove from './admin/AdminJerseyRemove';
import AdminJerseyDiscount from './admin/AdminJerseyDiscount';
import ProductDetail from './ProductDetail';
import CartPage from './CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthRedirect() {
  const navigate = useNavigate();
  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        await axios.get('/api/user');
        if (mounted) navigate('/dashboard');
      } catch (e) {
        if (mounted) navigate('/login');
      }
    };
    check();
    return () => { mounted = false; };
  }, [navigate]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/', '/login'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  const hideFooterPaths = ['/', '/login'];
  const showFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <div className="App">
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminRoles />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="jersey" element={<AdminJersey />} />
          <Route path="jersey/edit" element={<AdminJerseyEdit />} />
          <Route path="jersey/remove" element={<AdminJerseyRemove />} />
          <Route path="jersey/discount" element={<AdminJerseyDiscount />} />
        </Route>
  {/* Root redirects to dashboard when authenticated, otherwise to login */}
  <Route path="/" element={<AuthRedirect />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;