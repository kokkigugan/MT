// src/components/MultiStepForm.js

import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Stepper, Step, StepLabel, Typography } from '@mui/material';
import '../createCapm/cc.css';

const Cc = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    adAccountName: '',
    name: '',
    objective: '',
    status: '',
    specialAdCategory: ['NONE'],
  });
  const [campaigns, setCampaigns] = useState([]);

  const steps = ['Ad Account', 'Campaign Details', 'Objective & Status'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    fetch('{{Domain}}/{{APIV1}}/ads/add-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        fetchCampaigns();
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchCampaigns = () => {
    fetch('{{Domain}}/{{APIV1}}/ads/campaigns')
      .then(response => response.json())
      .then(data => {
        console.log('Campaigns fetched successfully', data);
        setCampaigns(data.data);
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    if (activeStep === steps.length) {
      fetchCampaigns();
    }
  }, [activeStep]);

  return (
    <div className="container">
      <div className="root">
        <Stepper activeStep={activeStep} className="stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length ? (
          <div>
            <Typography variant="h6" gutterBottom>
              All steps completed
            </Typography>
            <Button className="continueButton" onClick={handleSubmit}>Submit</Button>
            <div className="tableContainer">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr key={campaign.id}>
                      <td>{index + 1}</td>
                      <td>{campaign.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <Typography variant="h5" className="title">Business structure</Typography>
            <Typography variant="subtitle1" className="subtitle">
              DigiRoad collects this information to better understand and serve your business.
            </Typography>
            {getStepContent(activeStep, formData, handleChange)}
            <div className="buttonWrapper">
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" className="continueButton" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStepContent = (stepIndex, formData, handleChange) => {
  switch (stepIndex) {
    case 0:
      return (
        <div className="formContent">
          <TextField
            name="adAccountName"
            label="Ad Account Name"
            value={formData.adAccountName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
        </div>
      );
    case 1:
      return (
        <div className="formContent">
          <TextField
            name="name"
            label="Campaign Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
        </div>
      );
    case 2:
      return (
        <div className="formContent">
          <TextField
            name="objective"
            label="Objective"
            value={formData.objective}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            className="textField"
          >
            <MenuItem value="OUTCOME_LEADS">OUTCOME_LEADS</MenuItem>
            <MenuItem value="OUTCOME_SALES">OUTCOME_SALES</MenuItem>
          </TextField>
          <TextField
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            className="textField"
          >
            <MenuItem value="PAUSED">PAUSED</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          </TextField>
        </div>
      );
    default:
      return 'Unknown stepIndex';
  }
};

export default Cc;
