import React from 'react';
import { Home, LogOut } from 'lucide-react';

function Header({ userEmail, isAdmin, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Home size={32} />
          <div className="header-title">
            <h1>🍬 Sweet Shop</h1>
            <p>{isAdmin ? 'Admin Dashboard' : 'Customer Portal'}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="header-user">{userEmail}</span>
          <button
            onClick={onLogout}
            className="btn-logout"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;