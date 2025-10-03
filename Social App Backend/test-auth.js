const http = require("http");

console.log("🔍 Testing Authentication Endpoints...\n");

const baseURL = "http://localhost:3001";

// Test function
async function testEndpoint(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: endpoint,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  try {
    // Test 1: Health Check
    console.log("1. Testing Health Check...");
    const health = await testEndpoint("GET", "/api/health");
    console.log(`✅ Health Check: ${health.status} - ${health.data.status}\n`);

    // Test 2: Check Auth Status
    console.log("2. Testing Auth Check...");
    const authCheck = await testEndpoint("GET", "/api/auth/check");
    console.log(
      `✅ Auth Check: ${authCheck.status} - Authenticated: ${authCheck.data.authenticated}\n`
    );

    // Test 3: Test Signup
    console.log("3. Testing Signup...");
    const signupData = {
      username: "testuser",
      email: "test@rvu.edu.in",
      password: "password123",
    };

    try {
      const signup = await testEndpoint("POST", "/api/auth/signup", signupData);
      console.log(
        `✅ Signup: ${signup.status} - ${
          signup.data.message || signup.data.error
        }\n`
      );
    } catch (signupError) {
      console.log(
        `⚠️ Signup: ${signupError.message} (user might already exist)\n`
      );
    }

    // Test 4: Test Login
    console.log("4. Testing Login...");
    const loginData = {
      email: "test@rvu.edu.in",
      password: "password123",
    };

    try {
      const login = await testEndpoint("POST", "/api/auth/login", loginData);
      console.log(
        `✅ Login: ${login.status} - ${
          login.data.message || login.data.error
        }\n`
      );
    } catch (loginError) {
      console.log(`❌ Login Failed: ${loginError.message}\n`);
    }

    // Test 5: Get Current User (if logged in)
    console.log("5. Testing Get Current User...");
    try {
      const user = await testEndpoint("GET", "/api/auth/me");
      if (user.status === 200) {
        console.log(
          `✅ Current User: ${user.data.user.username} (${user.data.user.email})\n`
        );
      } else {
        console.log(`⚠️ Get User: ${user.status} - ${user.data.error}\n`);
      }
    } catch (userError) {
      console.log(`❌ Get User Failed: ${userError.message}\n`);
    }

    console.log("🎯 Testing Complete!");
  } catch (error) {
    console.log("❌ Server is not running or connection failed!");
    console.log("💡 Make sure to start your backend server first:");
    console.log("   cd backend");
    console.log("   npm start");
  }
}

// Run the tests
runTests();
