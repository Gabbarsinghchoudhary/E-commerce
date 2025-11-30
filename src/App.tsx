import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsappButton } from './components/WhatsappButton';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ManageAdmins } from './pages/ManageAdmins';
import { ManageMessages } from './pages/ManageMessages';
import { ManageUsers } from './pages/ManageUsers';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { TrackOrder } from './pages/TrackOrder';
import { Profile } from './pages/Profile';
import { ContactUs } from './pages/ContactUs';
import { AddProduct } from './pages/AddProduct';
import { ManageProducts } from './pages/ManageProducts';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { Shipping } from './pages/Shipping';
import { FAQs } from './pages/FAQs';
import { CancelOrder } from './pages/CancelOrder';
import { AboutUs } from './pages/AboutUs';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#06b6d4',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/manage-admins" element={<ManageAdmins />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-messages" element={<ManageMessages />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/manage-products" element={<ManageProducts />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/cancel-order" element={<CancelOrder />} />
                <Route path="/about" element={<AboutUs />} />
              </Routes>
              <Footer />
              <WhatsappButton />
            </div>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
