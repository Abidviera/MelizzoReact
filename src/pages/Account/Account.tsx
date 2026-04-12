import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { OrderService } from '../../services/orderService';
import type { Order } from '../../types';
import './Account.css';

type Tab = 'orders' | 'profile' | 'settings';

export default function Account() {
  const { user, isAuthenticated, isLoading, login, logout, register, updateProfile } = useAuth();
  const { success, error: notifyError } = useNotification();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="account">
        <div className="account__auth-container">
          <div className="account__auth-card">
            <h2 className="account__auth-title">
              {showRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="account__auth-sub">
              {showRegister ? 'Join MELiZZO for exclusive offers' : 'Sign in to your MELiZZO account'}
            </p>

            {!showRegister ? (
              <div className="account__form">
                <div className="account__field">
                  <label className="account__label">Email</label>
                  <input className="account__input" type="email" value={loginForm.email} onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                </div>
                <div className="account__field">
                  <label className="account__label">Password</label>
                  <input className="account__input" type="password" value={loginForm.password} onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))} placeholder="Your password" />
                </div>
                <button className="account__btn account__btn--primary" onClick={async () => {
                  const result = await login(loginForm.email, loginForm.password);
                  if (result.success) success('Welcome back!');
                  else notifyError(result.error || 'Login failed');
                }}>
                  Sign In
                </button>
                <p className="account__auth-switch">
                  Don't have an account?{' '}
                  <button onClick={() => setShowRegister(true)} className="account__auth-switch-btn">Create one</button>
                </p>
              </div>
            ) : (
              <div className="account__form">
                <div className="account__form--two-col">
                  <div className="account__field">
                    <label className="account__label">First Name</label>
                    <input className="account__input" value={registerForm.firstName} onChange={(e) => setRegisterForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="John" />
                  </div>
                  <div className="account__field">
                    <label className="account__label">Last Name</label>
                    <input className="account__input" value={registerForm.lastName} onChange={(e) => setRegisterForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Doe" />
                  </div>
                </div>
                <div className="account__field">
                  <label className="account__label">Email</label>
                  <input className="account__input" type="email" value={registerForm.email} onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                </div>
                <div className="account__field">
                  <label className="account__label">Password</label>
                  <input className="account__input" type="password" value={registerForm.password} onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" />
                </div>
                <div className="account__field">
                  <label className="account__label">Confirm Password</label>
                  <input className="account__input" type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm((f) => ({ ...f, confirmPassword: e.target.value }))} placeholder="Re-enter your password" />
                </div>
                <button className="account__btn account__btn--primary" onClick={async () => {
                  if (registerForm.password !== registerForm.confirmPassword) {
                    notifyError('Passwords do not match');
                    return;
                  }
                  const result = await register(registerForm.email, registerForm.password, registerForm.confirmPassword, registerForm.firstName, registerForm.lastName);
                  if (result.success) success('Account created!');
                  else notifyError(result.error || 'Registration failed');
                }}>
                  Create Account
                </button>
                <p className="account__auth-switch">
                  Already have an account?{' '}
                  <button onClick={() => setShowRegister(false)} className="account__auth-switch-btn">Sign in</button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const loadOrders = async () => {
    setActiveTab('orders');
    const { orders } = await OrderService.getOrders(1, 50);
    setOrders(orders);
  };

  return (
    <div className="account">
      <div className="account__container">
        {/* Sidebar */}
        <aside className="account__sidebar">
          <div className="account__user">
            <div className="account__user-avatar">
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="account__user-name">{user?.firstName} {user?.lastName}</p>
              <p className="account__user-email">{user?.email}</p>
            </div>
          </div>

          <nav className="account__nav">
            <button className={`account__nav-link ${activeTab === 'orders' ? 'account__nav-link--active' : ''}`} onClick={loadOrders}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              </svg>
              Orders
            </button>
            <button className={`account__nav-link ${activeTab === 'profile' ? 'account__nav-link--active' : ''}`} onClick={() => setActiveTab('profile')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </button>
            <button className={`account__nav-link ${activeTab === 'settings' ? 'account__nav-link--active' : ''}`} onClick={() => setActiveTab('settings')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              Settings
            </button>
          </nav>

          <button className="account__logout-btn" onClick={async () => { await logout(); success('Logged out successfully'); }}>
            Log Out
          </button>
        </aside>

        {/* Content */}
        <main className="account__content">
          {activeTab === 'orders' && (
            <div className="account__section">
              <h2 className="account__section-title">Order History</h2>
              {orders.length === 0 ? (
                <div className="account__empty">
                  <p>No orders yet</p>
                  <Link to="/shop" className="account__btn account__btn--primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="account__orders">
                  {orders.map((order) => (
                    <div key={order.id} className="account__order-card">
                      <div className="account__order-header">
                        <div>
                          <span className="account__order-number">{order.orderNumber}</span>
                          <span className={`account__order-status account__order-status--${order.status}`}>{order.status}</span>
                        </div>
                        <span className="account__order-date">{new Date(order.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="account__order-items">
                        {order.items.map((item) => (
                          <div key={item.id} className="account__order-item">
                            <img src={item.image} alt={item.name} className="account__order-item-img" />
                            <span className="account__order-item-name">{item.name}</span>
                            <span className="account__order-item-qty">x{item.quantity}</span>
                            <span className="account__order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="account__order-footer">
                        <span className="account__order-total">Total: ${order.total.toFixed(2)} CAD</span>
                        <span className="account__order-delivery">{order.estimatedDelivery}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="account__section">
              <h2 className="account__section-title">Profile Settings</h2>
              <div className="account__form">
                <div className="account__form--two-col">
                  <div className="account__field">
                    <label className="account__label">First Name</label>
                    <input className="account__input" value={profileForm.firstName} onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div className="account__field">
                    <label className="account__label">Last Name</label>
                    <input className="account__input" value={profileForm.lastName} onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className="account__field">
                  <label className="account__label">Email</label>
                  <input className="account__input" value={user?.email || ''} readOnly />
                </div>
                <div className="account__field">
                  <label className="account__label">Phone</label>
                  <input className="account__input" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 705 927-0127" />
                </div>
                <button className="account__btn account__btn--primary" onClick={async () => {
                  const result = await updateProfile(profileForm);
                  if (result.success) success('Profile updated!');
                  else notifyError(result.error || 'Update failed');
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="account__section">
              <h2 className="account__section-title">Account Settings</h2>
              <div className="account__settings-group">
                <h3 className="account__settings-group-title">Notifications</h3>
                <label className="account__toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Order updates via email</span>
                </label>
                <label className="account__toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Promotions and deals</span>
                </label>
                <label className="account__toggle">
                  <input type="checkbox" />
                  <span>SMS notifications</span>
                </label>
              </div>
              <div className="account__settings-group">
                <h3 className="account__settings-group-title">Privacy</h3>
                <p className="account__settings-text">Manage your data preferences and privacy settings.</p>
                <button className="account__btn account__btn--secondary">Manage Privacy</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
