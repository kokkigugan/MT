// src/components/Pages.js

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import '../pages/pages.css';

const fetchPages = async () => {
  const response = await fetch('{{Domain}}/{{APIV1}}/user/pages'); // Replace with your actual API endpoint
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.data;
};

const Pages = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handlePageClick = (pageId) => {
    navigate(`/pages/${pageId}`);
  };

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Pages</h1>
        <div className="pages-list">
          {data.map(page => (
            <div key={page.id} className="page-card" onClick={() => handlePageClick(page.id)}>
              <img src={page.picture ? page.picture.data.url : 'src/assets/icon.jpeg'} alt="Page Icon" />
              <div className="page-info">
                <span className="page-name">{page.name}</span>
                <p className="page-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
                <span className="explore-now">Explore Now</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pages;
