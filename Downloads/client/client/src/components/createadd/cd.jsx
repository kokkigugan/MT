import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, MenuItem, Stepper, Step, StepLabel, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
import './cd.css';

const CreateAd = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    adAccountName: '',
    adCampaignName: '',
    adSetName: '',
    adSetOptimizationGoal: '',
    adSetBillingEvent: '',
    adSetBidAmount: '',
    adSetDaily: '',
    adSetTargetingCities: [],
    adSetTargetingSocialPlatforms: [],
    adSetStatus: '',
    adPageId: ''
  });
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [submittedAdAccounts, setSubmittedAdAccounts] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const steps = ['Ad Account', 'Campaign Details', 'Ad Set Details', 'Targeting', 'Review & Submit'];

  useEffect(() => {
    axios.get('{{Domain}}/{{APIV1}}/user/adaccounts')
      .then(response => setAdAccounts(response.data.data || []))
      .catch(error => console.error('Error fetching ad accounts:', error));
  }, []);

  useEffect(() => {
    if (activeStep === 3) {
      const loader = new Loader({
        apiKey: 'AIzaSyBqcbN-d8g0j6dI_fCtEZZKRQ89rfDSu1E',
        version: 'weekly',
        libraries: ['places']
      });

      loader.load().then(() => {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 51.505, lng: -0.09 },
          zoom: 13,
        });

        mapInstance.current.addListener('click', (e) => {
          handleMapClick(e.latLng);
        });
      });
    }
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormData((prevFormData) => {
        const newPlatforms = checked
          ? [...prevFormData.adSetTargetingSocialPlatforms, value]
          : prevFormData.adSetTargetingSocialPlatforms.filter((platform) => platform !== value);
        return { ...prevFormData, adSetTargetingSocialPlatforms: newPlatforms };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMapClick = (latLng) => {
    const position = { lat: latLng.lat(), lng: latLng.lng() };
    setMarkers((current) => [...current, position]);
    setFormData((current) => ({
      ...current,
      adSetTargetingCities: [...current.adSetTargetingCities, position]
    }));
    new window.google.maps.Marker({
      position,
      map: mapInstance.current,
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.length > 2) {
      axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${event.target.value}`)
        .then((response) => {
          setSearchResults(response.data);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (result) => {
    const { lat, lon, display_name } = result;
    const position = { lat: parseFloat(lat), lng: parseFloat(lon) };

    setMarkers((current) => [...current, position]);
    setFormData((current) => ({
      ...current,
      adSetTargetingCities: [...current.adSetTargetingCities, position]
    }));

    mapInstance.current.setCenter(position);
    new window.google.maps.Marker({
      position,
      map: mapInstance.current,
    });

    setSearchResults([]);
    setSearchQuery(display_name);
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    fetch('{{Domain}}/{{APIV1}}/ads/add-adset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Fetch the ad accounts data after submission
        axios.get('{{Domain}}/{{APIV1}}/user/adaccounts')
          .then(response => setSubmittedAdAccounts(response.data.data || []))
          .catch(error => console.error('Error fetching ad accounts:', error));
      })
      .catch(error => console.error('Error:', error));
  };

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
            <h2>All steps completed</h2>
            <Button onClick={handleSubmit} className="continueButton">Submit</Button>
            <div>
              <h3>Ad Account Information</h3>
              <ul>
                {submittedAdAccounts.length > 0 ? (
                  submittedAdAccounts.map(account => (
                    <li key={account.id}>
                      {account.name} ({account.currency})
                    </li>
                  ))
                ) : (
                  <li>No ad accounts available</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep, formData, handleChange, markers, handleSearchChange, searchResults, handleSearchSelect, searchQuery, adAccounts, mapRef)}
            <div className="buttonWrapper">
              <Button disabled={activeStep === 0} onClick={handleBack} className="continueButton">
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext} className="continueButton">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStepContent = (stepIndex, formData, handleChange, markers, handleSearchChange, searchResults, handleSearchSelect, searchQuery, adAccounts, mapRef) => {
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
            select
            className="textField"
          >
            {adAccounts && adAccounts.length > 0 ? (
              adAccounts.map(account => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                No ad accounts available
              </MenuItem>
            )}
          </TextField>
        </div>
      );
    case 1:
      return (
        <div className="formContent">
          <TextField
            name="adCampaignName"
            label="Ad Campaign Name"
            value={formData.adCampaignName}
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
            name="adSetName"
            label="Ad Set Name"
            value={formData.adSetName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
          <TextField
            name="adSetOptimizationGoal"
            label="Optimization Goal"
            value={formData.adSetOptimizationGoal}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            className="textField"
          >
            <MenuItem value="REACH">REACH</MenuItem>
            <MenuItem value="CONVERSIONS">CONVERSIONS</MenuItem>
          </TextField>
          <TextField
            name="adSetBillingEvent"
            label="Billing Event"
            value={formData.adSetBillingEvent}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            className="textField"
          >
            <MenuItem value="IMPRESSIONS">IMPRESSIONS</MenuItem>
            <MenuItem value="CLICKS">CLICKS</MenuItem>
          </TextField>
          <TextField
            name="adSetBidAmount"
            label="Bid Amount"
            value={formData.adSetBidAmount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
          <TextField
            name="adSetDaily"
            label="Daily Budget"
            value={formData.adSetDaily}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
        </div>
      );
    case 3:
      return (
        <div className="formContent">
          <TextField
            name="search"
            label="Search for a place"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
            className="textField"
          />
          <div>
            {searchResults.length > 0 && searchResults.map((result, index) => (
              <div key={index} onClick={() => handleSearchSelect(result)} style={{ cursor: 'pointer', margin: '5px 0' }}>
                {result.display_name}
              </div>
            ))}
          </div>
          <div id="map" ref={mapRef} style={{ height: '400px', width: '100%', marginTop: '20px' }}></div>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={formData.adSetTargetingSocialPlatforms.includes('facebook')} onChange={handleChange} name="adSetTargetingSocialPlatforms" value="facebook" />}
              label="Facebook"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.adSetTargetingSocialPlatforms.includes('instagram')} onChange={handleChange} name="adSetTargetingSocialPlatforms" value="instagram" />}
              label="Instagram"
            />
          </FormGroup>
          <TextField
            name="adSetStatus"
            label="Ad Set Status"
            value={formData.adSetStatus}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
            className="textField"
          >
            <MenuItem value="PAUSED">PAUSED</MenuItem>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          </TextField>
          <TextField
            name="adPageId"
            label="Ad Page ID"
            value={formData.adPageId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="textField"
          />
        </div>
      );
    case 4:
      return (
        <div className="formContent">
          <h2>Review your details</h2>
          <p><strong>Ad Account Name:</strong> {formData.adAccountName}</p>
          <p><strong>Ad Campaign Name:</strong> {formData.adCampaignName}</p>
          <p><strong>Ad Set Name:</strong> {formData.adSetName}</p>
          <p><strong>Optimization Goal:</strong> {formData.adSetOptimizationGoal}</p>
          <p><strong>Billing Event:</strong> {formData.adSetBillingEvent}</p>
          <p><strong>Bid Amount:</strong> {formData.adSetBidAmount}</p>
          <p><strong>Daily Budget:</strong> {formData.adSetDaily}</p>
          <p><strong>Targeting Cities:</strong> {formData.adSetTargetingCities.map(city => `(${city.lat}, ${city.lng})`).join(', ')}</p>
          <p><strong>Targeting Social Platforms:</strong> {formData.adSetTargetingSocialPlatforms.join(', ')}</p>
          <p><strong>Ad Set Status:</strong> {formData.adSetStatus}</p>
          <p><strong>Ad Page ID:</strong> {formData.adPageId}</p>
        </div>
      );
    default:
      return 'Unknown stepIndex';
  }
};

export default CreateAd;
