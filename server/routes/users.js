const express = require('express');
const usersRouter = express.Router();
const pool = require('../db');
const {body, param} = require('express-validator');

const validate = validations => {
    return async (req, res, next) => {
      // sequential processing, stops running validations chain if one fails.
      for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
          return res.status(400).json({ errors: result.array() });
        }
      }
  
      next();
    };
  };

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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must have uppercase, lowercase, number and special character'),

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
    .optional()
    .isMobilePhone().withMessage('Mobile Phone format is not valid')
];

const loginUserValidation = [
    body('email')
    .trim()
    .isEmail().withMessage('Incorrect email format!'),

    body('password')
    .notEmpty().withMessage('Password must not be empty!')
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

//Create an account
usersRouter.post('/sign-up', validate(createAccountValidation),async(req,res)=>{
    const client= await pool.connect();
    try {
        await client.query('BEGIN');

        const { username, profile_img, email, password,phone} = req.body;

        //Case: an account with this email has already been created

        const user = await client.query(`SELECT * FROM users WHERE email = $1`,[email]);

        if(user.rows.length > 0){
            return res.send('There is already an account created with this email.');
        }

        function take_number(data){
            return data.rows.map(element => element.max).join(',');
           };

        const last_user = await client.query(`SELECT max(id) FROM users;`);
        const last_user_id = last_user? take_number(last_user): 0;
        const userId = last_user_id + 1;

        await client.query(`INSERT INTO users
            VALUES($1,$2,$3,$4,$5,$6,NOW())`,[userId, username, profile_img, email, password, phone ]);

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
usersRouter.post('/login', validate(loginUserValidation), async (req,res)=>{
    try {
        const [email, password] = req.body;

        const userQuery = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if(userQuery.rows.length < 1){
            return res.status(401).send('Incorrect email or password');
        };

        const user = userQuery.rows;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        };

        const token = jwt.sign(
            {id: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '1h'}
        )


        res.json({message: 'Login successful', token})
    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

usersRouter.get('/settings/my-account', async(req,res)=>{
    try {
        const userId = req.user.id;

        const userDetails = await pool.query(`
            SELECT * FROM users WHERE id = $1`, [userId]);

        if(userDetails.rows.length < 1){
            return res.status(404).send("We couldn't find the user details")
        };

        res.send(userDetails.rows)
    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

usersRouter.put('/settings/my-account', validate(updateAccountValidation), async(req,res)=>{
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`);
        const {username, profile_img,email, password, phone} = req.body;
        const userId = req.user.id;

        await client.query(`UPDATE users
            SET username = $1, profile_img = $2, email = $3, password = $4, phone = $5
            WHERE id = $6;`,[username, profile_img, email,password, phone,userId]);

        const modifiedUser = await client.query(`SELECT * FROM users WHERE id = $1`, [userId]);

        await client.query(`COMMIT`);
        res.send(modifiedUser.rows);

    } catch (err) {
        await client.query(`ROLLBACK`);
        res.status(500).json({error: 'server error', details: err.message});
    }finally{
        client.release();
    }
});

usersRouter.delete('/settings/my-account', async(req,res)=>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userId = req.user.id;
        const deletedUser = await client.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
        await client.query(`DELETE FROM users WHERE id = $1;`, [userId]);

        await client.query('COMMIT');
        res.send(deletedUser.rows);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({error: 'server error', details: err.message});
    }finally{
        client.release();
    }
});


//REVIEWS

usersRouter.get('/:id/reviews', async(req,res)=>{
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


usersRouter.post('/:id/reviews', validate(createReviewValidation), async(req, res) =>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const sellerId = req.params.id;
        const buyerId = req.user.id;
        const {car_id, content, rating} = req.body;

        function take_number(data){
            return data.rows.map(element => element.max).join(',');
           };

        const last_review = await client.query(`SELECT max(id) FROM reviews WHERE seller_id = $1`, [sellerId]);
        const last_review_id = last_review ? take_number(last_review) : 0;
        const review_id = last_review_id + 1;

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