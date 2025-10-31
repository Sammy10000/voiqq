import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  isSignUp?: boolean;
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  isSignUp = false,
  onToggleMode,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const { data, error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (authError) setError(authError.message);
    else if (data.user) {
      if (isSignUp)
        await supabase.from("profiles").insert({ id: data.user.id, email });
      onClose();
      navigate("/");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isSignUp ? "Sign Up" : "Log In"}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Sign in with Google
          </Button>
          <Typography variant="body2" align="center" sx={{ my: 1 }}>
            or use email
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
        </Button>
      </DialogActions>
      <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <Button size="small" onClick={onToggleMode}>
          {isSignUp ? "Log In" : "Sign Up"}
        </Button>
      </Typography>
    </Dialog>
  );
};

export default AuthModal;
