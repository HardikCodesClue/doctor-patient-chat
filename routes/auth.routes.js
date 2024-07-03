import express from "express";
import { createUser,getUserByEmail } from "../modules/user.modules.js";
import { USER_TYPE } from "../models/user.model.js";
import { encryptPassword ,validatePassword} from "../lib/auth.js";

const router = express.Router();

// Route to render the doctor registration form (GET /auth/doctor/register)
router.get("/doctor/register", (req, res) => {
  // Render the "doctor/register" view
  res.render("auth/doctor-register",{ error: null, body: null });
});

// Route to handle doctor registration form submission (POST /auth/doctor/register)
router.post("/doctor/register", async (req, res) => {
  try {
    // Extract the request body
    let body = req.body;

    // Check email in user table
    const checkEmail=await getUserByEmail(body.email)
    if(checkEmail)
    {
       return res.render("auth/doctor-register", { error: 'Email already exist', body });
    }

    // Set user type to DOCTOR
    body.userType = USER_TYPE.DOCTOR;

    // Encrypt password to DOCTOR
    body.password = await encryptPassword(body.password);

    // Create a new doctor user in the database
    const createdUser = await createUser(body);

    // Redirect to the doctor login page on successful registration
    res.redirect("/auth/login");
  } catch (e) {
    // Render the registration form again with error message if registration fails
    res.render("auth/doctor-register", { error: e.message,body: req.body });
  }
});

// Route to render the patient registration form (GET /patient/register)
router.get("/patient/register", (req, res) => {
  // Render the "patient/register" view
  res.render("auth/patient-register",{ error: null, body: null });
});

// Route to handle patient registration form submission (POST /auth/patient/register)
router.post("/patient/register", async (req, res) => {
  try {
    // Extract the request body
    let body = req.body;

    // Check email in user table
    const checkEmail=await getUserByEmail(body.email)
    if(checkEmail)
    {
       return res.render("auth/patient-register", { error: 'Email already exist', body });
    }

    // Set user type to PATIENT
    body.userType = USER_TYPE.PATIENT;

    // Encrypt password to PATIENT
    body.password = await encryptPassword(body.password);

    // Create a new patient user in the database
    const createdUser = await createUser(body);

    // Redirect to the patient login page on successful registration
    res.redirect("/auth/login");
  } catch (e) {
    // Render the registration form again with error message if registration fails
    res.render("auth/patient-register", { error: e.message,body: req.body });
  }
});

// Route to render the auth login form (GET /auth/login)
router.get("/login", (req, res) => {
    // Render the "auth/login" view
    res.render("auth/login",{ error: null, body: null });
});

// Route to handle auth login form submission (POST /auth/login)
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the email exists in the user database
      const user = await getUserByEmail(email);
      if (!user) {
        return res.render("auth/login", { error: "Invalid email or password", body: req.body });
      }
  
      // Validate the password
      const isValidPassword = await validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.render("auth/login", { error: "Invalid email or password", body: req.body });
      }
      
      req.session.user = user;

      // Redirect to auth dashboard on successful login
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      return res.render("auth/login", { error: error.message, body: req.body });
    }
});

// Route to handle auth logout form submission (POST /auth/logout)
router.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('auth/login');
  });
});

export default router;