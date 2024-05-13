import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/privateroute';
import LoginForm from "./scenes/login_register/loginForm";
import HomePage from "./scenes/homepage";
import TicketPage from "./scenes/tickets/ticketpage";
import CreateTicket from "./scenes/tickets/createticket";
import EditTicket from "./scenes/tickets/editticket";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApplicationContent />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

function ApplicationContent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticação e redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="app">
      <main className="content">
        {isAuthenticated && <Topbar setIsSidebar={() => {}} />}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/ticket" element={<PrivateRoute><TicketPage /></PrivateRoute>} />
          <Route path="/create-ticket" element={<PrivateRoute><CreateTicket /></PrivateRoute>} />
          <Route path="/edit-ticket/:ticketId" element={<PrivateRoute><EditTicket /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
