import { useState } from "react";
import { testSession, testAuth } from "../utils/sessionTest";

const SessionDebug = () => {
  const [sessionData, setSessionData] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestSession = async () => {
    setLoading(true);
    try {
      const data = await testSession();
      setSessionData(data);
    } catch (error) {
      setSessionData({ error: error.message });
    }
    setLoading(false);
  };

  const handleTestAuth = async () => {
    setLoading(true);
    try {
      const data = await testAuth();
      setAuthData(data);
    } catch (error) {
      setAuthData({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🔍 Session Debug Panel</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleTestSession}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Test Session
          </button>
          <button
            onClick={handleTestAuth}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test Auth
          </button>
        </div>

        {sessionData && (
          <div className="bg-white p-3 rounded">
            <h4 className="font-semibold">Session Data:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        )}

        {authData && (
          <div className="bg-white p-3 rounded">
            <h4 className="font-semibold">Auth Data:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDebug;