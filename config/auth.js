// auth.js
import { configUrl } from './config1.js';

const config = configUrl



window.onload = async function() {
  await authenticateUser();
};

async function authenticateUser() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  console.log(accessToken,refreshToken)

  if (!accessToken) {
    window.location.href = 'index.html';
    console.log('acess not found')
    
  } else {
    const isValid = await verifyAccessToken(accessToken);
    if (!isValid) {
      if (!refreshToken) {
        window.location.href = 'index.html';
        console.log('refresh not found')
      } else {
        const newAccessToken = await refreshAccessToken(accessToken,refreshToken);
        if (newAccessToken) {
          localStorage.setItem('access_token', newAccessToken);
          const isValidAfterRefresh = await verifyAccessToken(newAccessToken);
          if (isValidAfterRefresh) {
            console.log('Token valid after refresh.');
          } else {
            window.location.href = 'index.html';
            console.log('Error1')
          }
        } else {
          window.location.href = 'index.html';
          console.log('Error2')
        }
      }
    } else {
      console.log('Token valid.');
    }
  }
}

async function verifyAccessToken(accessToken) {
  try {
    console.log("Access Token: ", `Bearer ${String(accessToken)}`);  // Log to check
    const response = await fetch(`${config.serverUrl}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (response.status === 200 && data.message === 'Token_valid') {
      return true;
    } else {
        console.log("Invalid token response:", data);
        return false;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

async function refreshAccessToken(accessToken,refreshToken) {
  try {
    console.log("Refresh Token: ", refreshToken);  // Log to check
    const response = await fetch(`${config.serverUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json();
    if (response.status === 200 && data.access_token) {
      return data.access_token;
    }
    console.log("Error refreshing token:", data);
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
 
  