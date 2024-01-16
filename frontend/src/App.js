import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import FounderSidebar from './scenes/global/FounderSidebar'; // Import the founder sidebar
import InvestorDashboard from './scenes/investor_dashboard';
import Contacts from './scenes/contacts';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Form from './scenes/form';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation(); // Get the current location

  // Determine which sidebar to render
  const renderSidebar = () => {
    if (location.pathname.startsWith('/founder')) {
      return <FounderSidebar />;
    } else {
      return <Sidebar isSidebar={isSidebar} />;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {renderSidebar()} {/* Call the function to render the correct sidebar */}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/investor" element={<InvestorDashboard />} />
              <Route path="/investor/matches" element={<Contacts />} />
              <Route path="/founder" element={<InvestorDashboard />} /> {/* Update this to founder dashboard when ready */}
              <Route path="/form" element={<Form />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
