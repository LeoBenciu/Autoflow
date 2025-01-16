const express = require('express');
const usersRouter = express.Router();
const pool = require('../db');
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../auth');


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

//Create an account
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

//Login
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

usersRouter.post('/logout', (req,res)=>{
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Logged out successfully' });
    });
});


//GOOGLE
usersRouter.get('/auth/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}));

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