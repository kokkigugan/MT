import React, { useEffect, useState } from 'react';
import { useNavigate  , } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const userName = localStorage.getItem('fb_user_name');
  const userPicture = localStorage.getItem('fb_user_picture');
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('{{Domain}}/{{APIV1}}/ads/campaigns'); // Update with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCampaigns(data.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCardClick = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  return (
    <div className="home-container">
      {/* <nav className="navbar">
        <div className="user-info">
          {userName && <span className="user-name">{userName}</span>}
          {userPicture && <img src={userPicture} alt={`${userName}'s profile`} className="user-avatar" />}
        </div>
      </nav> */}
      <div className="welcome-section">
        <h1>Welcome to Shown!</h1>
        <p>Create & Convert: Unleash Your First Campaign</p>
        <button  className="create-campaign-btn" >+ Create a New ad Campaign</button> 
      </div>
      <div className="background-images">
        <img src="/src/assets/twitter.svg" alt="Twitter" className="bg-icon twitter-icon" />
        <img src="/src/assets/instagraminsta.svg" alt="Instagram" className="bg-icon instagram-icon" />
        <img src="/src/assets/Linkedin.svg" alt="LinkedIn" className="bg-icon linkedin-icon" />
        <img src="/src/assets/bg.svg" alt="Chart Pie" className="bg-icon chart-pie-icon" />
        <img src="/src/assets/Group 3.svg" alt="Lightbulb" className="bg-icon lightbulb-icon" />
        <img src="/src/assets/vector.svg" alt="Rocket" className="bg-icon rocket-icon" />
        <img src="/src/assets/google.svg" alt="Google" className="bg-icon google-icon" />
      </div>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card" onClick={() => handleCardClick(campaign.id)}>
            <h2>{campaign.name}</h2>
            <div className="card-footer">
              <span className="card-date">Campaign ID: {campaign.id}</span>
              <span className="card-read-more">View Campaign</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
