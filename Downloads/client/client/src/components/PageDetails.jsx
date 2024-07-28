import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../components/pageinsi.css';

const fetchPageInsights = async (pageId, pageAccessToken, since, until) => {
  let url = `{{Domain}}/{{APIV1}}/pages/insights?pageId=${pageId}&access_token=${pageAccessToken}`;
  if (since && until) {
    url += `&since=${since}&until=${until}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

const PageDetails = () => {
  const { pageId } = useParams();
  const [searchParams] = useSearchParams();
  const pageAccessToken = searchParams.get('pageAccessToken');
  const [insights, setInsights] = useState([]);
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  useEffect(() => {
    if (pageAccessToken) {
      fetchPageInsights(pageId, pageAccessToken, since, until).then(setInsights).catch(console.error);
    }
  }, [pageId, pageAccessToken, since, until]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'since') setSince(value);
    if (name === 'until') setUntil(value);
  };

  const processData = () => {
    const metrics = {};
    insights.forEach(insight => {
      insight.values.forEach(value => {
        const date = value.end_time.split('T')[0];
        metrics[date] = metrics[date] || { date };
        metrics[date][insight.name] = value.value;
      });
    });
    return Object.values(metrics);
  };

  return (
    <div className="page-details-container">
      <header className="page-header">
        <h1>Page Insights</h1>
      </header>

      <div className="date-picker">
        <label>
          Since:
          <input type="date" name="since" value={since} onChange={handleDateChange} />
        </label>
        <label>
          Until:
          <input type="date" name="until" value={until} onChange={handleDateChange} />
        </label>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={processData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="page_post_engagements" stackId="a" fill="#8884d8" />
            <Bar dataKey="page_impressions" stackId="a" fill="#82ca9d" />
            <Bar dataKey="page_fans" stackId="a" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PageDetails;
