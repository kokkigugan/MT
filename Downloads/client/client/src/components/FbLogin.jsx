import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { arcsData } from '../data/arcs';
import { World } from './ui/globe';
import { SocialIcon } from 'react-social-icons';
import { transform } from 'framer-motion';

const styles = {
  loginContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f0f2f5',
  },
  loginBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    color: '#1877f2',
    marginBottom: '20px',
  },
  status: {
    marginTop: '20px',
    fontSize: '16px',
    color: '#4b4f56',
  },
  globeContainer: {
    position: 'relative',
    display: 'flex',
    // flex: 1,
    height: '80vh',
    width: '40%',
  },
  socials: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1',
  },
  icon: {
    margin: '0 4px',
    boxShadow: '5px 4px 8px rgba(0, 0, 0, 0.4)'
  },
  iconPosition: [
    { top: '-50px' },
    { top: '60px'},
    { bottom: '60px'},
    { bottom: '-50px'},
  ],
};

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const FacebookLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Define the checkLoginState function globally
    window.checkLoginState = function () {
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
      });
    };

    // Initialize the Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1518751785720798',
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: 'v20.0', // Use this Graph API version for this call.
      });

      // Check login status after initialization
      window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response); // Returns the login status.
      });
    };

    // Load the Facebook SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Called with the results from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') {
      // Logged into your webpage and Facebook.
      // Save the access token to localStorage
      localStorage.setItem('fb_access_token', response.authResponse.accessToken);
      testAPI();
      // Navigate to the /home page
      navigate("/home");
    } else {
      // Not logged into your webpage or we are unable to tell.
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.innerHTML = 'Please log into this webpage.';
      }
    }
  }

  // Testing Graph API after login.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me?fields=name,picture', function (response) {
      console.log('Successful login for: ' + response.name);
      localStorage.setItem('fb_user_name', response.name);
      localStorage.setItem('fb_user_picture', response.picture.data.url);
      const statusElement = document.getElementById('status');
      if (statusElement) {
        statusElement.innerHTML = 'Thanks for logging in, ' + response.name + '!';
      }
    });
  }

  useEffect(() => {
    // Ensure the Facebook button is configured correctly after the SDK is loaded
    if (!document.getElementById('fb-login-button')) {
      const fbButton = document.createElement('div');
      fbButton.id = 'fb-login-button'; // Added id to check if button already exists
      fbButton.className = 'fb-login-button';
      fbButton.setAttribute('data-width', '');
      fbButton.setAttribute('data-size', 'large');
      fbButton.setAttribute('data-button-type', 'continue_with');
      fbButton.setAttribute('data-layout', 'default');
      fbButton.setAttribute('data-auto-logout-link', 'false');
      fbButton.setAttribute('data-use-continue-as', 'true');
      fbButton.setAttribute('data-config_id', '1625178464937252');
      fbButton.setAttribute('onlogin', 'checkLoginState();');
      document.getElementById('fb-button-container').appendChild(fbButton);

      // Re-parse XFBML to ensure the button is rendered
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, []);

  return (
  <div style={styles.loginContainer}>
    <div style={styles.loginBox}>
      <h1 style={styles.title} className=''>Welcome</h1>
      <p>Please log in to continue</p>
      {/* The JS SDK Login Button Container */}
      <div id="fb-button-container"></div>
      <div id="status" style={styles.status}></div>
    </div>
    <div style={styles.globeContainer}>
      <span style={styles.socials}>
        <SocialIcon url="https://instagram.com" style={{ ...styles.icon, ...styles.iconPosition[0] }}/>
        <SocialIcon url="https://telegram.com" style={{ ...styles.icon, ...styles.iconPosition[1] }}/>
        <SocialIcon url="https://discord.com" style={{ ...styles.icon, ...styles.iconPosition[2] }}/>
        <SocialIcon url="https://facebook.com" style={{ ...styles.icon, ...styles.iconPosition[3] }}/>
      </span>
      <World data={arcsData} globeConfig={globeConfig} />
    </div>
  </div>
  );
};

export default FacebookLogin;
