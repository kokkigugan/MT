import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [user, setUser] = useState({
    name: localStorage.getItem('fb_user_name'),
    picture: localStorage.getItem('fb_user_picture')
  });

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('fb_user_name');
    const picture = localStorage.getItem('fb_user_picture');
    if (name && picture) {
      setUser({ name, picture });
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar bg-primary text-primary-foreground w-64 h-full fixed top-0 left-0 p-4">
      <div className="sidebar-header flex flex-col items-center mb-8">
        {user.picture && <img src={user.picture} alt="Profile" className="sidebar-profile-pic w-20 h-20 rounded-full mb-4" />}
        {user.name && <h2 className="sidebar-username text-xl font-semibold">{user.name}</h2>}
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/home')}>
          <i className="fas fa-th-large mr-3"></i>
          <span>Dashboard</span>
        </div>
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/pages')}>
          <i className="fas fa-copy mr-3"></i>
          <span>Pages</span>
        </div>
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/assets')}>
          <i className="fas fa-folder mr-3"></i>
          <span>Assets</span>
        </div>
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/cc')}>
          <i className="fas fa-bullhorn mr-3"></i>
          <span>Campaign</span>
        </div>
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/ads')}>
          <i className="fas fa-ad mr-3"></i>
          <span>Ads</span>
        </div>
        <div className="sidebar-item flex items-center mb-4 cursor-pointer hover:bg-secondary p-2 rounded" onClick={() => handleNavigation('/page/:pageId')}>
          <i className="fas fa-ad mr-3"></i>
          <span>Pagein</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
