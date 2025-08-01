// Quick test script to check profile loading issues
// Using Node.js built-in fetch (Node 18+)

async function testProfileEndpoints() {
  console.log('🔍 Testing profile system...\n');
  
  // Test 1: Check if backend is accessible
  try {
    console.log('1. Testing backend ping...');
    const pingResponse = await fetch('https://prepmate-kvol.onrender.com/api/internal/ping');
    console.log(`   ✅ Backend ping: ${pingResponse.status} ${pingResponse.statusText}`);
  } catch (error) {
    console.log(`   ❌ Backend ping failed: ${error.message}`);
  }
  
  // Test 2: Check profile route without email (should fail with 400)
  try {
    console.log('\n2. Testing profile route without email...');
    const profileResponse = await fetch('https://prepmate-kvol.onrender.com/api/profile/user');
    console.log(`   Status: ${profileResponse.status} ${profileResponse.statusText}`);
    const data = await profileResponse.json();
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   ❌ Profile route test failed: ${error.message}`);
  }
  
  // Test 3: Check profile route with dummy email (should fail with 404)
  try {
    console.log('\n3. Testing profile route with dummy email...');
    const profileResponse = await fetch('https://prepmate-kvol.onrender.com/api/profile/user?email=test@example.com');
    console.log(`   Status: ${profileResponse.status} ${profileResponse.statusText}`);
    const data = await profileResponse.json();
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   ❌ Profile route with email test failed: ${error.message}`);
  }
  
  // Test 4: Check CORS headers
  try {
    console.log('\n4. Testing CORS headers...');
    const corsResponse = await fetch('https://prepmate-kvol.onrender.com/api/profile/user?email=test@example.com', {
      method: 'OPTIONS'
    });
    console.log(`   CORS preflight: ${corsResponse.status} ${corsResponse.statusText}`);
    console.log(`   CORS headers:`, Object.fromEntries(corsResponse.headers.entries()));
  } catch (error) {
    console.log(`   ❌ CORS test failed: ${error.message}`);
  }
}

testProfileEndpoints().catch(console.error);
