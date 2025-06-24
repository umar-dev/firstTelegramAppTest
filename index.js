import React, { useState, useEffect } from 'react';

// Main App component
function App() {
  const [telegramWebApp, setTelegramWebApp] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initData, setInitData] = useState(''); // State for initData
  const [themeParams, setThemeParams] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Effect to load the Telegram Web Apps SDK script
  useEffect(() => {
    const scriptId = 'telegram-webapp-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = () => {
        if (window.Telegram && window.Telegram.WebApp) {
          const webApp = window.Telegram.WebApp;
          setTelegramWebApp(webApp);
          webApp.ready(); // Inform Telegram that the app is ready

          // Set initial user and theme data
          setUserData(webApp.initDataUnsafe?.user || null);
          setInitData(webApp.initData || ''); // Store the full initData string
          setThemeParams(webApp.themeParams || null);

          // Listen for theme changes
          webApp.onEvent('themeChanged', () => {
            setThemeParams(webApp.themeParams);
          });

          setMessage('Telegram Web App SDK loaded and ready!');
        } else {
          setError('Telegram Web App SDK not found after loading.');
        }
      };
      script.onerror = () => {
        setError('Failed to load Telegram Web App SDK script.');
      };
      document.body.appendChild(script);
    } else if (window.Telegram && window.Telegram.WebApp) {
      // If script is already loaded and WebApp object exists (e.g., on re-renders)
      const webApp = window.Telegram.WebApp;
      setTelegramWebApp(webApp);
      setUserData(webApp.initDataUnsafe?.user || null);
      setInitData(webApp.initData || ''); // Store the full initData string
      setThemeParams(webApp.themeParams || null);
      setMessage('Telegram Web App SDK already loaded.');
    }
  }, []);

  // Function to close the Telegram Web App
  const handleCloseWebApp = () => {
    if (telegramWebApp && telegramWebApp.close) {
      telegramWebApp.close();
    } else {
      setMessage('Telegram WebApp close function not available.');
    }
  };

  // Function to expand the Telegram Web App to full screen
  const handleExpandWebApp = () => {
    if (telegramWebApp && telegramWebApp.expand) {
      telegramWebApp.expand();
      setMessage('Web App expanded to full screen.');
    } else {
      setMessage('Telegram WebApp expand function not available.');
    }
  };

  // Dynamic styling based on Telegram theme
  const appBackgroundColor = themeParams?.bg_color || '#ffffff';
  const textColor = themeParams?.text_color || '#000000';
  const buttonColor = themeParams?.button_color || '#007bff';
  const buttonTextColor = themeParams?.button_text_color || '#ffffff';

  // Helper to get user's display name
  const getUserDisplayName = () => {
    if (!userData) return 'N/A';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    if (userData.first_name) {
      return userData.first_name;
    }
    if (userData.username) {
      return `@${userData.username}`;
    }
    return 'Unknown User';
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: appBackgroundColor, color: textColor }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
        style={{
          backgroundColor: themeParams?.secondary_bg_color || '#f0f0f0',
          color: textColor,
        }}
      >
        <h1 className="text-3xl font-bold mb-4">Hello Telegram Web App!</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {userData ? (
          <div className="mb-6 text-left">
            <h2 className="text-xl font-semibold mb-2">User Data:</h2>
            <p>
              <strong>Display Name:</strong> {getUserDisplayName()}
            </p>
            <p>
              <strong>ID:</strong> {userData.id}
            </p>
            {userData.username && (
              <p>
                <strong>Username:</strong> @{userData.username}
              </p>
            )}
            {userData.language_code && (
              <p>
                <strong>Language Code:</strong> {userData.language_code}
              </p>
            )}
          </div>
        ) : (
          <p className="mb-6">No user data available (might not be opened from Telegram, or data is not provided).</p>
        )}

        <div className="mb-6 text-left">
          <h2 className="text-xl font-semibold mb-2">Telegram Init Data (Auth Data):</h2>
          {initData ? (
            <div className="bg-gray-100 p-3 rounded text-sm break-all" style={{ backgroundColor: themeParams?.secondary_bg_color || '#e2e8f0', color: textColor }}>
              <p>{initData}</p>
              <p className="text-xs text-gray-500 mt-2">
                *This data is used by your bot's backend to verify the authenticity of the user and the session. It is not a persistent user access token.*
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No init data available.</p>
          )}
        </div>

        <div className="mb-6 text-left">
          <h2 className="text-xl font-semibold mb-2">Theme Parameters:</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto" style={{ backgroundColor: themeParams?.secondary_bg_color || '#e2e8f0', color: textColor }}>
            {JSON.stringify(themeParams, null, 2)}
          </pre>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleExpandWebApp}
            className="w-full px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          >
            Expand Web App
          </button>
          <button
            onClick={handleCloseWebApp}
            className="w-full px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          >
            Close Web App
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
