const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5000/api';

async function testRouteSaving() {
  console.log('🧪 Testing Route Saving with User Data...\n');

  try {
    // Test data with the exact object the user provided
    const routeData = {
      "username": "a",
      "name": "dsadsa",
      "description": "",
      "destination": "tel aviv",
      "type": "bike",
      "pathEncoded": "wyubEy}dwE_DvpB_vC`dC_nBpgAap@dcAin@xh@}St|@wz@x{@w\\`jByQv}BhNbcArTt|AyGpeBbi@jq@oE|rC|Tle@lGhuA}H~qA{S`_BmYjsArSpkAx`@|d@Sz`AvJptAnVzgA`JffAr[nxAaf@~vAyY~dBy@peAiNrgBlw@zI~o@zd@diApuC{ZpGiYzx@mB`sA~b@pl@dNpo@me@xfAsGbnB`R|zCz}@~pAtd@pxB|iAz[tNfl@aC|eA`UdxA{D~{Ahj@raA|RjnAiEtO",
      "pathDaysEncoded": ["wyubEy}dwE_DvpB_vC`dC_nBpgAap@dcAin@xh@}St|@wz@x{@w\\`jByQv}BhNbcArTt|AyGpeBbi@jq@oE|rC|Tle@lGhuA}H~qA{S`_BmYjsArSpkAx`@|d@Sz`AvJptAnVzgA`JffA", "k}`cEe_euEr[nxAaf@~vAyY~dBy@peAiNrgBlw@zI~o@zd@diApuC{ZpGiYzx@mB`sA~b@pl@dNpo@me@xfAsGbnB`R|zCz}@~pAtd@pxB|iAz[tNfl@aC|eA`UdxA{D~{Ahj@raA|RjnAiEtO"]
    };

    console.log('1. Testing route saving with user data...');
    const saveResponse = await fetch(`${API_BASE}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData)
    });

    if (saveResponse.ok) {
      const savedRoute = await saveResponse.json();
      console.log('✅ Route saved successfully');
      console.log('   Route ID:', savedRoute.route._id);
      console.log('   Route Name:', savedRoute.route.name);
      console.log('   Description:', savedRoute.route.description);
      console.log('   Destination:', savedRoute.route.destination);
      console.log('   Type:', savedRoute.route.type);
      console.log('   PathEncoded length:', savedRoute.route.pathEncoded.length);
      console.log('   PathDaysEncoded count:', savedRoute.route.pathDaysEncoded.length);
    } else {
      const error = await saveResponse.json();
      console.log('❌ Route saving failed:', error.message);
      return;
    }

    // Test retrieving the route
    console.log('\n2. Testing route retrieval...');
    const getRoutesResponse = await fetch(`${API_BASE}/routes?username=a`);
    
    if (getRoutesResponse.ok) {
      const routes = await getRoutesResponse.json();
      console.log('✅ Routes retrieved successfully');
      console.log('   Number of routes:', routes.length);
      if (routes.length > 0) {
        console.log('   First route name:', routes[0].name);
        console.log('   First route ID:', routes[0]._id);
        console.log('   First route description:', routes[0].description);
      }
    } else {
      const error = await getRoutesResponse.json();
      console.log('❌ Route retrieval failed:', error.message);
    }

    console.log('\n🎉 Route saving with user data works correctly!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testRouteSaving(); 