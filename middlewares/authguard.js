export const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login"); // Redirect to login if user is not logged in
    }
    next(); // Proceed to the next middleware or route handler
};