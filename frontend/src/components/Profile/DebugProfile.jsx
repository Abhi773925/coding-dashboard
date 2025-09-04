// Debug Profile Component
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
const DebugProfile = () => {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    console.log('🐛 Debug Profile Component Mounted');
    console.log('🔑 IsLoggedIn:', isLoggedIn);
    console.log('👤 User:', user);
    console.log('📧 User Email:', user?.email);
    console.log('📛 User Name:', user?.name);
    
    // Test API endpoint directly
    if (user?.email) {
      console.log('🌐 Testing API endpoint...');
      fetch(`https://prepmate-kvol.onrender.com/api/profile/user?email=${user.email}`)
        .then(response => {
          console.log('📡 API Response Status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('📊 API Response Data:', data);
        })
        .catch(error => {
          console.error('❌ API Error:', error);
        });
    }
  }, [user, isLoggedIn]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Debug Information</h1>
      
      <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p><strong>Logged In:</strong> {isLoggedIn ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User Object:</strong> {user ? '✅ Present' : '❌ Missing'}</p>
      </div>

      {user && (
        <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold mb-2">User Details</h2>
          <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
          <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
          <p><strong>Avatar:</strong> {user.avatar ? '✅ Present' : '❌ Missing'}</p>
          <p><strong>Google ID:</strong> {user.googleId || 'Not provided'}</p>
        </div>
      )}

      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
        <p>1. Check the console for detailed logs</p>
        <p>2. Verify API endpoint response</p>
        <p>3. Check network tab for any failed requests</p>
      </div>
    </div>
  );
};

export default DebugProfile;
