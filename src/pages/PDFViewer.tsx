import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import { usePDFStore } from "../store/usePDFStore";
import {
  Container,
  Typography,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";

// Set PDF.js worker (CDN for simplicity)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PDFViewer: React.FC = () => {
  const { pdfId } = useParams<{ pdfId: string }>();
  const { currentPDF, clearPDF } = usePDFStore();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [textContent, setTextContent] = useState(""); // For ARIA accessibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentPDF && pdfId) {
      setLoading(true);
      const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(currentPDF));
      loadingTask.promise
        .then((pdf) => {
          setNumPages(pdf.numPages);
          pdf.getPage(pageNumber).then((page) => {
            page.getTextContent().then((content) => {
              setTextContent(content.items.map((item) => item.str).join(" "));
              setLoading(false);
            });
          });
        })
        .catch((err) => {
          console.error("PDF load error:", err);
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [currentPDF, pdfId, pageNumber, navigate]);

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="lg">
      <Box my={2}>
        <Typography variant="h4" component="h1" role="heading" aria-level={1}>
          Viewing: {currentPDF?.name || "PDF"}
        </Typography>
        <Typography
          role="main"
          aria-label={`Page ${pageNumber} content`}
          style={{ marginBottom: "20px", whiteSpace: "pre-wrap" }}
        >
          {textContent.substring(0, 500)}...{" "}
          {/* Truncated for demo; full text for screen readers */}
        </Typography>
        <Box
          sx={{
            border: "1px solid #ddd",
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>
            PDF Page {pageNumber} Render Placeholder (Add Canvas for Full
            Render)
          </Typography>
        </Box>
        <Box textAlign="center" mt={2}>
          <Button
            onClick={clearPDF}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button href="/pro" variant="contained" sx={{ ml: 2 }}>
            Upgrade for Tagging
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PDFViewer;
