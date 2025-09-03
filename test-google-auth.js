// Simple test script to verify Google authentication endpoint
// Run this with: node test-google-auth.js

const testGoogleAuth = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        googleId: 'test-google-id-123',
        image: 'https://example.com/image.jpg',
      }),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', data);
      console.log('Access token received:', !!data.access_token);
    } else {
      const errorData = await response.json();
      console.error('Error response:', errorData);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

// Run the test
testGoogleAuth();
