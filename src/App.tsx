import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import PDFViewer from "./pages/PDFViewer";
import Pro from "./pages/Pro";
import AuthModal from "./components/AuthModal";

const theme = createTheme({
  palette: { primary: { main: "#5A44FF" } },
});

const ProtectedProRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return session ? <>{children}</> : <Navigate to="/" replace />; // Redirect to Home for pro
};

function App() {
  const { session } = useAuth();
  const [authOpen, setAuthOpen] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);

  const handleAuthClose = () => setAuthOpen(false);
  const toggleAuthMode = () => setIsSignUp(!isSignUp);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: "100vh", padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home openAuth={authOpen} onToggleAuth={toggleAuthMode} />
              }
            />
            <Route path="/viewer/:pdfId" element={<PDFViewer />} />{" "}
            {/* Public */}
            <Route
              path="/pro"
              element={
                <ProtectedProRoute>
                  <Pro />
                </ProtectedProRoute>
              }
            />{" "}
            {/* Protected */}
          </Routes>
        </div>
      </Router>
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        isSignUp={isSignUp}
        onToggleMode={toggleAuthMode}
      />
    </ThemeProvider>
  );
}

export default App;
