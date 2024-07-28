// src/components/Posts.js

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import '../pages/pages.css';

const fetchPosts = async (pageId) => {
  const response = await fetch(`{{Domain}}/{{APIV1}}/pages/posts?pageId=${pageId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.data;
};

const Posts = () => {
  const { pageId } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts', pageId],
    queryFn: () => fetchPosts(pageId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Posts for {data.pageName}</h1>
        <div className="pages-list">
          {data.posts.map(post => (
            <div key={post.postId} className="page-card">
              <img src={post.fullPicture} alt="Post" />
              <div className="page-info">
                <p className="page-description">{post.story || 'No description available'}</p>
                <a className="explore-now" href={post.permalinkUrl} target="_blank" rel="noopener noreferrer">View Post</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
