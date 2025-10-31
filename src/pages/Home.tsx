import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import { usePDFStore } from "../store/usePDFStore";

interface HomeProps {
  openAuth?: boolean; // From App for pro redirect
  onToggleAuth?: () => void; // Toggle sign-up/login
}

const Home: React.FC<HomeProps> = ({ openAuth = false, onToggleAuth }) => {
  const navigate = useNavigate();
  const { setCurrentPDF } = usePDFStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: File[]) => {
    if (files.length === 0) return;
    const pdfFile = files[0];
    if (!pdfFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    if (pdfFile.size > 10 * 1024 * 1024) {
      setError("File too large—max 10MB for free users.");
      return;
    }
    setError(null);
    setUploading(true);
    const pdfId = pdfFile.name.replace(/\.[^/.]+$/, "");
    setCurrentPDF(pdfFile, pdfId);
    setUploading(false);
    navigate(`/viewer/${pdfId}`);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={5}>
        <Typography variant="h2" gutterBottom>
          Voiqq
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Free PDF reading for everyone. Pro for tagging and more.
        </Typography>
        <Box
          sx={{
            border: "2px dashed #ccc",
            p: 4,
            borderRadius: 1,
            minHeight: "200px",
            cursor: "pointer",
            transition: "border-color 0.3s",
            "&:hover": { borderColor: "#5A44FF" },
          }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => handleUpload(Array.from(e.target.files || []))}
            style={{ display: "none" }}
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload">
            <Typography>Drag & drop a PDF or click to select</Typography>
          </label>
        </Box>
        {uploading && <Alert severity="info">Loading PDF...</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box mt={3}>
          <Typography variant="body2">
            Unlock pro tagging?{" "}
            <Button href="/pro" variant="outlined">
              Upgrade
            </Button>
          </Typography>
        </Box>
        {openAuth && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Sign up to access Pro features.{" "}
            <Button onClick={onToggleAuth} variant="text">
              Get Started
            </Button>
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Home;
