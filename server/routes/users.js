const express = require('express');
const usersRouter = express.Router();
const pool = require('../db');
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
})


const createAccountValidation = [
    body('username')
    .trim()
    .isLength({min: 2, max:50}).withMessage('Username must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
    .trim()
    .isEmail().withMessage('Incorrect email format!'),

    body('password')
    .isLength({min:8}).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.,*?&])[A-Za-z\d@$!.,%*?&]{8,}$/).withMessage('Password must have uppercase, lowercase, number and special character(@$!%.,*?&)'),

    body('phone')
    .isMobilePhone().withMessage('Mobile Phone format is not valid')

];

const updateAccountValidation = [
    body('username')
    .optional()
    .trim()
    .isLength({min: 2, max:50}).withMessage('Username must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Incorrect email format!'),

    body('password')
    .optional()
    .isLength({min:8}).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must have uppercase, lowercase, number and special character'),

    body('phone')
    .optional({ nullable: true })
    .if((value) => value !== null && value !== '')
    .isMobilePhone().withMessage('Mobile Phone format is not valid')
];

const createReviewValidation = [
    param('id').isInt().withMessage('Invalid Seller Id'),

    body('car_id').isInt().withMessage('Invalid Buyer Id'),

    body('content')
    .optional()
    .trim()
    .isLength({min: 15, max: 500}).withMessage('Content must be between 15 to 500 characters long'),

    body('rating')
    .isInt({min:1, max: 5}). withMessage('Rating must be between 1 and 5')
];


// ACCOUNTS
const passwordHash = async(password, saltRounds) =>{
    try{
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch(err){
      console.log(err)
    }
    return null;
  };

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user by providing username, email, password, and phone number.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountRequest'
 *           example:
 *             username: "john_doe"
 *             profile_img: "http://localhost:3000/images/profile.jpg"
 *             email: "john.doe@example.com"
 *             password: "SecureP@ssw0rd!"
 *             phone: "+1234567890"
 *     responses:
 *       200:
 *         description: Successfully created a new user account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               username: "john_doe"
 *               profile_img: "http://localhost:3000/images/profile.jpg"
 *               email: "john.doe@example.com"
 *               phone: "+1234567890"
 *               created_at: "2025-01-25T10:20:30Z"
 *       400:
 *         description: Bad request due to validation errors or email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ValidationError:
 *                 value:
 *                   errors:
 *                     - msg: "Username must be between 2 and 50 characters"
 *                       param: "username"
 *                       location: "body"
 *                     - msg: "There is already an account created with this email."
 *                       param: "email"
 *                       location: "body"
 *               EmailInUse:
 *                 value:
 *                   error: "There is already an account created with this email."
 *       500:
 *         description: Internal server error during account creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     CreateAccountRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username for the user.
 *           example: "john_doe"
 *         profile_img:
 *           type: string
 *           format: uri
 *           description: URL to the user's profile image.
 *           example: "http://localhost:3000/images/profile.jpg"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: User's password.
 *           example: "SecureP@ssw0rd!"
 *         phone:
 *           type: string
 *           description: User's mobile phone number.
 *           example: "+1234567890"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user.
 *           example: 1
 *         username:
 *           type: string
 *           description: User's username.
 *           example: "john_doe"
 *         profile_img:
 *           type: string
 *           format: uri
 *           description: URL to the user's profile image.
 *           example: "http://localhost:3000/images/profile.jpg"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: User's mobile phone number.
 *           example: "+1234567890"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user account was created.
 *           example: "2025-01-25T10:20:30Z"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "There is already an account created with this email."
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           description: List of validation errors.
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 description: Error message.
 *                 example: "Username must be between 2 and 50 characters"
 *               param:
 *                 type: string
 *                 description: Parameter that caused the error.
 *                 example: "username"
 *               location:
 *                 type: string
 *                 description: Location of the parameter (e.g., body, query).
 *                 example: "body"
 */
usersRouter.post('/signup', createAccountValidation,async(req,res)=>{
    const client= await pool.connect();
    try {
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
        await client.query('BEGIN');

        const { username, profile_img, email, password,phone} = req.body;

        //Case: an account with this email has already been created

        const user = await client.query(`SELECT * FROM users WHERE email = $1`,[email]);

        if(user.rows.length > 0){
            return res.status(400).json({
                errors: [{
                    path: 'email',
                    msg: 'There is already an account created with this email.'
                }]
            });
        };

        function take_number(data){
            return data.rows.map(element => element.max).join(',');
           };

        const last_user = await client.query(`SELECT max(id) FROM users;`);
        const last_user_id = last_user? take_number(last_user): 0;
        const userId = Number(last_user_id) + 1;

        const hashedPassword = await passwordHash(password,10);


        await client.query(`INSERT INTO users
            VALUES($1,$2,$3,$4,$5,$6,NOW())`,[userId, username, profile_img, email, hashedPassword, phone ]);

        const createdUser = await client.query(`SELECT * FROM users WHERE id = $1`, [userId]);

        if(createdUser.rows.length < 1){
            return res.status(404).send("We could't find the user");
        };

        await client.query('COMMIT');

        res.send(createdUser.rows);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({error: 'server error', details: err.message});
    }finally{
        client.release();
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user with their email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "SecureP@ssw0rd!"
 *     responses:
 *       200:
 *         description: Successfully authenticated the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Login successful"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the user.
 *                       example: 1
 *                     username:
 *                       type: string
 *                       description: The user's username.
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email address.
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       description: The user's phone number.
 *                       example: "+1234567890"
 *       401:
 *         description: Authentication failed due to invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message detailing the authentication failure.
 *                   example: "Invalid email or password."
 *       500:
 *         description: Internal server error during authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: General error message.
 *                   example: "Authentication service unavailable."
 *                 details:
 *                   type: string
 *                   description: Additional details about the error.
 *                   example: "Failed to connect to the authentication server."
 */
usersRouter.post('/login', (req, res, next) => {
    console.log('Login attempt with:', {
        email: req.body.email,
        passwordProvided: !!req.body.password 
    });

    passport.authenticate('local', (err, user, info) => {
        console.log('Authentication result:', {
            error: err,
            userFound: !!user,
            info: info
        });

        if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.status(401).json({ error: info.message });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ error: err.message });
            }

            console.log('Login successful for user:', user.email);
            return res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone
                }
            });
        });
    })(req, res, next);
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Log out the authenticated user and destroy their session.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Logged out successfully"
 *       500:
 *         description: Internal server error during logout.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Failed to destroy session"
 */
usersRouter.post('/logout', (req,res)=>{
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     description: Request a password reset link to be sent to the user's email.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Password reset email sent"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Incorrect email format!"
 *                   param: "email"
 *                   location: "body"
 *       404:
 *         description: User not found with the provided email.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Internal server error during password reset initiation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's registered email address.
 *           example: "john.doe@example.com"
 */
usersRouter.post('/forgot-password', async(req,res)=>{
    const client = await pool.connect();
    try{
        const {email} = req.body;

        const user = await client.query(`
            SELECT * FROM users WHERE email = $1`,[email]);
        if(user.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
        };

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        await client.query(`
            UPDATE users SET reset_token = $1, 
            reset_token_expiry = $2 WHERE email = $3`, 
            [resetToken, resetTokenExpiry,email]);

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'AutoFlow Password Reset',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset email sent' });

    }catch(err){
        res.status(500).json({ error: 'Server error', details: err.message });
    }finally{
        client.release();
    }
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Reset the user's password using a valid reset token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           example:
 *             token: "abcdef123456"
 *             newPassword: "NewSecureP@ssw0rd!"
 *     responses:
 *       200:
 *         description: Password successfully reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Password successfully reset"
 *       400:
 *         description: Invalid or expired reset token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Invalid or expired reset token"
 *       500:
 *         description: Internal server error during password reset.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Password reset token received via email.
 *           example: "abcdef123456"
 *         newPassword:
 *           type: string
 *           description: New password for the user.
 *           example: "NewSecureP@ssw0rd!"
 */
usersRouter.post('/reset-password', async(req,res)=>{
    const client = await pool.connect();
    try{
        const {token, newPassword} = req.body;

        const user = await client.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if(user.rows.length === 0){
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        };

        const hashedPassword = await passwordHash(newPassword,10);

        await client.query(
            'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [hashedPassword, user.rows[0].id]
        );

        res.json({ message: 'Password successfully reset' });

    }catch(err){
        res.status(500).json({ error: 'Server error', details: err.message });      
    }finally{
        client.release();
    }
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     description: Redirects the user to Google's OAuth2 consent screen for authentication.
 *     tags:
 *       - Users
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth2 consent screen.
 */
usersRouter.get('/auth/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Handles the callback after Google OAuth2 authentication.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code returned by Google.
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: false
 *         description: State parameter to maintain state between the request and callback.
 *     responses:
 *       302:
 *         description: Redirect to the client application with user data.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             example: "<html><body>Redirecting...</body></html>"
 *       401:
 *         description: Authentication failed. Redirected to login.
 */
usersRouter.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/users/login',
    }), 
    (req, res) => {
        const userData = {
            message: 'Login successful',
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone
            }
        };

        res.redirect(`http://localhost:5173/home?userData=${encodeURIComponent(JSON.stringify(userData))}`);
    }
);


/**
 * @swagger
 * /settings/my-account:
 *   get:
 *     summary: Retrieve authenticated user's account details
 *     description: Fetch detailed account information for the authenticated user, including location details.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user account details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAccountDetails'
 *             example:
 *               id: 1
 *               username: "john_doe"
 *               profile_img: "http://localhost:3000/images/profile.jpg"
 *               email: "john.doe@example.com"
 *               phone: "+1234567890"
 *               created_at: "2025-01-25T10:20:30Z"
 *               location_id: 321
 *               address: "1234 Elm Street"
 *               city: "Los Angeles"
 *               state: "California"
 *               country: "USA"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: User details not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "We couldn't find the user details"
 *       500:
 *         description: Internal server error while retrieving account details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     UserAccountDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user.
 *           example: 1
 *         username:
 *           type: string
 *           description: User's username.
 *           example: "john_doe"
 *         profile_img:
 *           type: string
 *           format: uri
 *           description: URL to the user's profile image.
 *           example: "http://localhost:3000/images/profile.jpg"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: User's mobile phone number.
 *           example: "+1234567890"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user account was created.
 *           example: "2025-01-25T10:20:30Z"
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the user's location.
 *           example: 321
 *         address:
 *           type: string
 *           description: Street address of the user's location.
 *           example: "1234 Elm Street"
 *         city:
 *           type: string
 *           description: City of the user's location.
 *           example: "Los Angeles"
 *         state:
 *           type: string
 *           description: State of the user's location.
 *           example: "California"
 *         country:
 *           type: string
 *           description: Country of the user's location.
 *           example: "USA"
 */
usersRouter.get('/settings/my-account', isAuthenticated,async(req,res)=>{
    try {
        const userId = req.user.id;

        const userDetails = await pool.query(`
            SELECT * FROM users
            LEFT JOIN locations
            ON users.location_id = locations.location_id 
            WHERE id = $1`, [userId]);

        if(userDetails.rows.length < 1){
            return res.status(404).send("We couldn't find the user details")
        };

        res.send(userDetails.rows)
    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

/**
 * @swagger
 * /settings/my-account:
 *   put:
 *     summary: Update authenticated user's account details
 *     description: Update the authenticated user's account information, including username, email, password, and phone number.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccountRequest'
 *           example:
 *             username: "john_doe_updated"
 *             email: "john.doe.updated@example.com"
 *             password: "NewSecureP@ssw0rd!"
 *             phone: "+1987654321"
 *     responses:
 *       200:
 *         description: Successfully updated user account details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateAccountSuccessResponse'
 *             example:
 *               message: "User updated successfully"
 *               user:
 *                 id: 1
 *                 username: "john_doe_updated"
 *                 email: "john.doe.updated@example.com"
 *                 phone: "+1987654321"
 *       400:
 *         description: Bad request due to validation errors or no updates provided.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "No updates provided"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Internal server error during account update.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     UpdateAccountRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: New username for the user.
 *           example: "john_doe_updated"
 *         email:
 *           type: string
 *           format: email
 *           description: New email address for the user.
 *           example: "john.doe.updated@example.com"
 *         password:
 *           type: string
 *           description: New password for the user.
 *           example: "NewSecureP@ssw0rd!"
 *         phone:
 *           type: string
 *           description: New mobile phone number for the user.
 *           example: "+1987654321"
 *     UpdateAccountSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message.
 *           example: "User updated successfully"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: Unique identifier for the user.
 *               example: 1
 *             username:
 *               type: string
 *               description: User's updated username.
 *               example: "john_doe_updated"
 *             email:
 *               type: string
 *               format: email
 *               description: User's updated email address.
 *               example: "john.doe.updated@example.com"
 *             phone:
 *               type: string
 *               description: User's updated mobile phone number.
 *               example: "+1987654321"
 */
usersRouter.put('/settings/my-account', isAuthenticated, updateAccountValidation, async (req, res) => {
    const client = await pool.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, profile_img, email, password, phone } = req.body;
        const userId = req.user.id;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (username) {
            updates.push(`username = $${paramCount}`);
            values.push(username);
            paramCount++;
        }
        
        if (profile_img) {
            updates.push(`profile_img = $${paramCount}`);
            values.push(profile_img);
            paramCount++;
        }
        
        if (email) {
            updates.push(`email = $${paramCount}`);
            values.push(email);
            paramCount++;
        }
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password = $${paramCount}`);
            values.push(hashedPassword);
            paramCount++;
        }
        
        if (phone) {
            updates.push(`phone = $${paramCount}`);
            values.push(phone);
            paramCount++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        values.push(userId);

        await client.query('BEGIN');

        const updateQuery = `
            UPDATE users 
            SET ${updates.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING id, username, email, phone`;

        const modifiedUser = await client.query(updateQuery, values);

        if (modifiedUser.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'User not found' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'User updated successfully',
            user: modifiedUser.rows[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Update user error:', err);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    } finally {
        client.release();
    }
});

/**
 * @swagger
 * /settings/my-account:
 *   delete:
 *     summary: Delete authenticated user's account
 *     description: Permanently delete the authenticated user's account and all related data.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the user account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               username: "john_doe"
 *               profile_img: "http://localhost:3000/images/profile.jpg"
 *               email: "john.doe@example.com"
 *               phone: "+1234567890"
 *               created_at: "2025-01-25T10:20:30Z"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       403:
 *         description: Forbidden. The user is not authorized to delete this account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *               message: "You can only delete your own posts"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Internal server error during account deletion.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal server error"
 *               details: "Detailed error message explaining what went wrong."
 */
usersRouter.delete('/settings/my-account', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const userDeleted = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
  
      if (!userDeleted.rows[0]) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid');
        res.json(userDeleted.rows[0]);
      });

    } catch (err) {
      console.error('Delete account error:', err);
      res.status(500).json({ 
        error: 'Internal server error',
        details: err.message
      });
    }
});

/**
 * @swagger
 * /settings/my-account/location:
 *   put:
 *     summary: Update authenticated user's location
 *     description: Update the authenticated user's location details, including country, state, city, zip code, and street address.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLocationRequest'
 *           example:
 *             country: "USA"
 *             state: "California"
 *             city: "Los Angeles"
 *             zip_code: "90001"
 *             street_address: "5678 Maple Street"
 *     responses:
 *       200:
 *         description: Successfully updated location details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateLocationSuccessResponse'
 *             example:
 *               message: "Location updated successfully"
 *               location:
 *                 location_id: 321
 *                 address: "5678 Maple Street"
 *                 city: "Los Angeles"
 *                 state: "California"
 *                 zip_code: "90001"
 *                 country: "USA"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal server error"
 *               details: "Detailed error message explaining what went wrong."
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: User or location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Internal server error during location update.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Internal server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     UpdateLocationRequest:
 *       type: object
 *       properties:
 *         country:
 *           type: string
 *           description: Country of the user's location.
 *           example: "USA"
 *         state:
 *           type: string
 *           description: State of the user's location.
 *           example: "California"
 *         city:
 *           type: string
 *           description: City of the user's location.
 *           example: "Los Angeles"
 *         zip_code:
 *           type: string
 *           description: ZIP code of the user's location.
 *           example: "90001"
 *         street_address:
 *           type: string
 *           description: Street address of the user's location.
 *           example: "5678 Maple Street"
 *     UpdateLocationSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message.
 *           example: "Location updated successfully"
 *         location:
 *           type: object
 *           properties:
 *             location_id:
 *               type: integer
 *               description: Unique identifier for the location.
 *               example: 321
 *             address:
 *               type: string
 *               description: Street address of the location.
 *               example: "5678 Maple Street"
 *             city:
 *               type: string
 *               description: City of the location.
 *               example: "Los Angeles"
 *             state:
 *               type: string
 *               description: State of the location.
 *               example: "California"
 *             zip_code:
 *               type: string
 *               description: ZIP code of the location.
 *               example: "90001"
 *             country:
 *               type: string
 *               description: Country of the location.
 *               example: "USA"
 */
usersRouter.put('/settings/my-account/location', isAuthenticated, async(req, res) => {
    const client = await pool.connect();
    try {
        const { country, state, city, zip_code, street_address } = req.body;
        const userId = req.user.id;

        await client.query('BEGIN');

        const userLocationResult = await client.query(
            'SELECT location_id FROM users WHERE id = $1',
            [userId]
        );

        if (userLocationResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'User not found' });
        }

        const existingLocationId = userLocationResult.rows[0].location_id;
        let locationResult;

        const updates = [];
        const values = [];
        let paramCount = 1;

        for (const [field, value] of Object.entries({ 
            country, state, city, zip_code, street_address 
        })) {
            if (value) {
                updates.push(`${field} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        if (!existingLocationId) {
            const nextIdResult = await client.query(
                'SELECT COALESCE(MAX(location_id) + 1, 1) as next_id FROM locations'
            );
            const nextLocationId = nextIdResult.rows[0].next_id;
        
            const fields = ['location_id'];
            const insertValues = [nextLocationId];
        
            if (country) {
                fields.push('country');
                insertValues.push(country);
            }
            if (state) {
                fields.push('state');
                insertValues.push(state);
            }
            if (city) {
                fields.push('city');
                insertValues.push(city);
            }
            if (zip_code) {
                fields.push('zip_code');
                insertValues.push(zip_code);
            }
            if (street_address) {
                fields.push('street_address');
                insertValues.push(street_address);
            }
        
            const createLocationQuery = `
                INSERT INTO locations (${fields.join(', ')})
                VALUES (${insertValues.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING location_id, city, state, zip_code, country, street_address
            `;
        
            locationResult = await client.query(createLocationQuery, insertValues);
        
            await client.query(
                'UPDATE users SET location_id = $1 WHERE id = $2',
                [locationResult.rows[0].location_id, userId]
            );
        } else {
            values.push(existingLocationId);
            const updateLocationQuery = `
                UPDATE locations 
                SET ${updates.join(', ')}
                WHERE location_id = $${paramCount}
                RETURNING location_id, city, state, zip_code, country, street_address
            `;

            locationResult = await client.query(updateLocationQuery, values);
        }

        await client.query('COMMIT');

        res.json({
            message: 'Location updated successfully',
            location: locationResult.rows[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Update location error:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            details: err.message
        });
    } finally {
        client.release();
    }
});


/**
 * @swagger
 * /{id}/reviews:
 *   get:
 *     summary: Retrieve reviews for a specific seller
 *     description: Fetch all reviews associated with a specific seller by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The unique identifier of the seller.
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *             example:
 *               - id: 101
 *                 buyer_id: 2
 *                 seller_id: 1
 *                 car_id: 456
 *                 content: "Great seller! The car was in excellent condition."
 *                 rating: 5
 *                 created_at: "2025-01-26T12:30:45Z"
 *               - id: 102
 *                 buyer_id: 3
 *                 seller_id: 1
 *                 car_id: 456
 *                 content: "Smooth transaction and responsive communication."
 *                 rating: 4
 *                 created_at: "2025-01-27T09:15:20Z"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: No reviews found for the specified seller.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "We couldn't find any reviews"
 *       500:
 *         description: Internal server error while retrieving reviews.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the review.
 *           example: 101
 *         buyer_id:
 *           type: integer
 *           description: Unique identifier for the buyer who wrote the review.
 *           example: 2
 *         seller_id:
 *           type: integer
 *           description: Unique identifier for the seller being reviewed.
 *           example: 1
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car involved in the transaction.
 *           example: 456
 *         content:
 *           type: string
 *           description: Content of the review.
 *           example: "Great seller! The car was in excellent condition."
 *         rating:
 *           type: integer
 *           description: Rating given by the buyer (1-5).
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was created.
 *           example: "2025-01-26T12:30:45Z"
 */
usersRouter.get('/:id/reviews', isAuthenticated,async(req,res)=>{
    try {
        const sellerId = req.params.id;

        const query = await pool.query(`
            SELECT * FROM reviews WHERE seller_id = $1`, [sellerId]);
        
        if (query.rows.length < 1){
            return res.status(404).send("W'e couldn't find any reviews");
        };

        res.send(query.rows);

    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message})
    }
});

/**
 * @swagger
 * /{id}/reviews:
 *   post:
 *     summary: Create a review for a seller
 *     description: Submit a new review for a specific seller, including car details, review content, and rating.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The unique identifier of the seller being reviewed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *           example:
 *             car_id: 456
 *             content: "Great seller! The car was in excellent condition."
 *             rating: 5
 *     responses:
 *       200:
 *         description: Successfully created a new review.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *             example:
 *               id: 101
 *               buyer_id: 2
 *               seller_id: 1
 *               car_id: 456
 *               content: "Great seller! The car was in excellent condition."
 *               rating: 5
 *               created_at: "2025-01-26T12:30:45Z"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Invalid Seller Id"
 *                   param: "id"
 *                   location: "path"
 *                 - msg: "Invalid Buyer Id"
 *                   param: "car_id"
 *                   location: "body"
 *                 - msg: "Content must be between 15 to 500 characters long"
 *                   param: "content"
 *                   location: "body"
 *                 - msg: "Rating must be between 1 and 5"
 *                   param: "rating"
 *                   location: "body"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: User or seller not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "We couldn't find the user"
 *       500:
 *         description: Internal server error during review creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     CreateReviewRequest:
 *       type: object
 *       required:
 *         - car_id
 *         - rating
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car involved in the transaction.
 *           example: 456
 *         content:
 *           type: string
 *           description: Content of the review.
 *           example: "Great seller! The car was in excellent condition."
 *         rating:
 *           type: integer
 *           description: Rating given by the buyer (1-5).
 *           example: 5
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the review.
 *           example: 101
 *         buyer_id:
 *           type: integer
 *           description: Unique identifier for the buyer who wrote the review.
 *           example: 2
 *         seller_id:
 *           type: integer
 *           description: Unique identifier for the seller being reviewed.
 *           example: 1
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car involved in the transaction.
 *           example: 456
 *         content:
 *           type: string
 *           description: Content of the review.
 *           example: "Great seller! The car was in excellent condition."
 *         rating:
 *           type: integer
 *           description: Rating given by the buyer (1-5).
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the review was created.
 *           example: "2025-01-26T12:30:45Z"
 */
usersRouter.post('/:id/reviews', isAuthenticated,createReviewValidation, async(req, res) =>{
    const client = await pool.connect();
    try {
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
        await client.query('BEGIN');

        const sellerId = req.params.id;
        const buyerId = req.user.id;
        const {car_id, content, rating} = req.body;

        function take_number(data){
            return data.rows.map(element => element.max).join(',');
           };

        const last_review = await client.query(`SELECT max(id) FROM reviews WHERE seller_id = $1`, [sellerId]);
        const last_review_id = last_review ? take_number(last_review) : 0;
        const review_id = Number(last_review_id) + 1;

        await client.query(`
            INSERT INTO reviews
            VALUES(
            $1, $2, $3, $4, $5, $6, NOW())`, [review_id, buyerId, sellerId, car_id, content, rating]);

        const result = await client.query(`
            SELECT * FROM reviews WHERE id = $1`, [review_id]);

        await client.query('COMMIT');

        res.send(result.rows);

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({error: 'server error', details: err.message})
    }finally{
       client.release();
    }
});



module.exports = usersRouter;