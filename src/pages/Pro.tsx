import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_your_key_here"); // Replace with test key

const Pro: React.FC = () => {
  const navigate = useNavigate();
  const [subStatus, setSubStatus] = useState<"free" | "pro">("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { session },
    } = supabase.auth.getSession();
    if (session) {
      supabase
        .from("profiles")
        .select("sub_status")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          setSubStatus(data?.sub_status || "free");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  if (subStatus === "pro") {
    return (
      <Container maxWidth="sm">
        <Alert severity="success">You're Pro! Enjoy tagging.</Alert>
        <Button onClick={() => navigate("/")}>Back to Reader</Button>
      </Container>
    );
  }

  const handleUpgrade = async () => {
    const stripe = await stripePromise;
    if (stripe) {
      stripe.redirectToCheckout({
        lineItems: [{ price: "price_pro_tier_id", quantity: 1 }],
        mode: "subscription",
        successUrl: "http://localhost:5173/?success=true",
        cancelUrl: "http://localhost:5173/?canceled=true",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Voiqq Pro
          </Typography>
          <Typography paragraph align="center">
            Unlock AI tagging and unlimited access for $4.99/month.
          </Typography>
          <Box textAlign="center">
            <Button variant="contained" size="large" onClick={handleUpgrade}>
              Start Free Trial
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Pro;
