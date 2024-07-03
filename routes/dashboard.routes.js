import express from "express";
import { USER_TYPE } from "../models/user.model.js";
import { getUserByUserType } from "../modules/user.modules.js";

const router = express.Router();

// Route to render dashboard form (GET /dashboard)
router.get("/", async (req, res) => {
    try {
        // Check user session
        const user = req.session.user;
        
        // Initialize userData array
        let userData = [];

        // Determine which users to fetch based on user's userType
        if (user.userType === USER_TYPE.DOCTOR) {
            // Fetch patients if user is a doctor
            userData = await getUserByUserType(USER_TYPE.PATIENT);
        } else {
            // Fetch doctors if user is not a doctor (assuming userType is not DOCTOR)
            userData = await getUserByUserType(USER_TYPE.DOCTOR);
        }

        // Render the "dashboard/dashboard" view with userData and userId
        res.render('dashboard/dashboard', { userData, userId: user._id });
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle errors appropriately (e.g., render an error page or redirect)
        res.status(500).send("Internal Server Error");
    }
});

export default router;
