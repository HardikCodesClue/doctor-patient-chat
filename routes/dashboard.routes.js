import express from "express";

const router = express.Router();

// Route to render dashboard form (GET /)
router.get("/", (req, res) => {
    // Render the "dashboard/dashboard" view
    res.render("dashboard/dashboard",{ error: null, body: null });
  });

export default router;