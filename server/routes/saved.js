const express = require('express');
const savedRouter = express.Router();
const pool = require('../db');
const { body, param, validationResult } = require('express-validator');
const isAuthenticated = require('../auth');

const createSavedPostValidation = [
body('post_id')
.isInt().withMessage('Invalid Post Id')
];

const deleteSavedPostValidation = [
param('id')
.isInt().withMessage('Invalid Saved Post Id')
];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all saved posts for the authenticated user
 *     description: Fetch a list of all posts that the authenticated user has saved.
 *     tags:
 *       - Saved Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of saved posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the saved entry.
 *                     example: 1
 *                   post_id:
 *                     type: integer
 *                     description: Unique identifier for the associated post.
 *                     example: 123
 *                   user_id:
 *                     type: integer
 *                     description: Unique identifier for the user who saved the post.
 *                     example: 789
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the post was saved.
 *                     example: "2025-01-25T10:20:30Z"
 *                   posts:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                         description: Unique identifier for the post.
 *                         example: 123
 *                       title:
 *                         type: string
 *                         description: Title of the post.
 *                         example: "Selling my 2018 Toyota Camry"
 *                       car_id:
 *                         type: integer
 *                         description: Unique identifier for the associated car.
 *                         example: 456
 *                       # Additional post fields can be added here
 *                   cars:
 *                     type: object
 *                     properties:
 *                       car_id:
 *                         type: integer
 *                         description: Unique identifier for the car.
 *                         example: 456
 *                       brand:
 *                         type: string
 *                         description: Brand of the car.
 *                         example: "Toyota"
 *                       model:
 *                         type: string
 *                         description: Model of the car.
 *                         example: "Camry"
 *                       year:
 *                         type: integer
 *                         description: Manufacturing year of the car.
 *                         example: 2018
 *                       price:
 *                         type: number
 *                         description: Price of the car.
 *                         example: 20000
 *                       mileage:
 *                         type: integer
 *                         description: Mileage of the car.
 *                         example: 15000
 *                       fuel:
 *                         type: string
 *                         description: Fuel type of the car.
 *                         example: "Petrol"
 *                       traction:
 *                         type: string
 *                         description: Traction type of the car.
 *                         example: "FWD"
 *                       engine_size:
 *                         type: number
 *                         description: Engine size in liters.
 *                         example: 2.5
 *                       engine_power:
 *                         type: integer
 *                         description: Engine power in HP.
 *                         example: 203
 *                       transmission:
 *                         type: string
 *                         description: Transmission type.
 *                         example: "Automatic"
 *                       color:
 *                         type: string
 *                         description: Exterior color of the car.
 *                         example: "Blue"
 *                       interior_color:
 *                         type: string
 *                         description: Interior color of the car.
 *                         example: "Black"
 *                       body:
 *                         type: string
 *                         description: Body type of the car.
 *                         example: "Sedan"
 *                       country:
 *                         type: string
 *                         description: Country where the car is located.
 *                         example: "USA"
 *                       state:
 *                         type: string
 *                         description: State where the car is located.
 *                         example: "California"
 *                       location_id:
 *                         type: integer
 *                         description: Unique identifier for the location.
 *                         example: 321
 *                       address:
 *                         type: string
 *                         description: Address of the location.
 *                         example: "1234 Elm Street"
 *                       city:
 *                         type: string
 *                         description: City of the location.
 *                         example: "Los Angeles"
 *                       location_state:
 *                         type: string
 *                         description: State of the location.
 *                         example: "California"
 *                       location_country:
 *                         type: string
 *                         description: Country of the location.
 *                         example: "USA"
 *                   locations:
 *                     type: object
 *                     properties:
 *                       location_id:
 *                         type: integer
 *                         description: Unique identifier for the location.
 *                         example: 321
 *                       address:
 *                         type: string
 *                         description: Address of the location.
 *                         example: "1234 Elm Street"
 *                       city:
 *                         type: string
 *                         description: City of the location.
 *                         example: "Los Angeles"
 *                       state:
 *                         type: string
 *                         description: State of the location.
 *                         example: "California"
 *                       country:
 *                         type: string
 *                         description: Country of the location.
 *                         example: "USA"
 *                   image_urls:
 *                     type: array
 *                     description: List of image URLs associated with the car.
 *                     items:
 *                       type: string
 *                       format: uri
 *                       example: "http://localhost:3000/images/car1.jpg"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing what went wrong.
 *                   example: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error while retrieving saved posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: General error message.
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   description: Additional details about the error.
 *                   example: "Detailed error message explaining what went wrong."
 */
savedRouter.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const results = await pool.query(`
            SELECT 
                saved.*,
                posts.*,
                cars.*,
                locations.*,
                array_agg(images.image_url) as image_urls
            FROM saved
            LEFT JOIN posts 
                ON saved.post_id = posts.post_id
            LEFT JOIN cars
                ON posts.car_id = cars.car_id
            LEFT JOIN locations
                ON cars.location_id = locations.location_id
            LEFT JOIN images
                ON images.car_id = cars.car_id
            WHERE saved.user_id = $1
            GROUP BY 
                saved.id,
                posts.post_id,
                cars.car_id,
                locations.location_id;
        `, [userId]);

        if (results.rows.length < 1) {
            return res.status(200).json([]);
        }

        const host = req.get('host');
        const protocol = req.protocol;

        const transformedResults = results.rows.map(row => ({
            ...row,
            image_urls: row.image_urls && row.image_urls[0] !== null
                ? row.image_urls.map(url => `${protocol}://${host}${url}`)
                : []
        }));

        res.json(transformedResults);
    } catch (err) {
        console.error('Error in saved posts:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create or toggle a saved post
 *     description: Save a post for the authenticated user. If the post is already saved, it will be removed (toggled).
 *     tags:
 *       - Saved Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *                 description: Unique identifier of the post to be saved or removed.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully saved or removed the post.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Success message.
 *                       example: "Post Removed Successfully"
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the saved entry.
 *                       example: 1
 *                     post_id:
 *                       type: integer
 *                       description: Unique identifier for the associated post.
 *                       example: 123
 *                     user_id:
 *                       type: integer
 *                       description: Unique identifier for the user who saved the post.
 *                       example: 789
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the post was saved.
 *                       example: "2025-01-25T10:20:30Z"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: List of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: Error message.
 *                         example: "Invalid Post Id"
 *                       param:
 *                         type: string
 *                         description: Parameter that caused the error.
 *                         example: "post_id"
 *                       location:
 *                         type: string
 *                         description: Location of the parameter (e.g., body, query).
 *                         example: "body"
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "We couldn't find the selected post"
 *       500:
 *         description: Internal server error during saving or removing the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: General error message.
 *                   example: "server error"
 *                 details:
 *                   type: string
 *                   description: Additional details about the error.
 *                   example: "Detailed error message explaining what went wrong."
 */
savedRouter.post('/',isAuthenticated, createSavedPostValidation, async (req,res)=>{
        const client = await pool.connect();
        try {
            const errors= validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            };

            await client.query('BEGIN');

            const userId = req.user.id;
            const {post_id} = req.body;

            const post = await client.query(`SELECT * FROM posts WHERE post_id = $1`, [post_id]);

            const excistingSavedPost = await client.query(`
                SELECT * FROM saved 
                WHERE post_id=$1 AND user_id=$2`,[post_id, userId]);

            if(excistingSavedPost.rows.length > 0){

                await client.query(`
                    DELETE FROM saved
                    WHERE post_id=$1 AND user_id=$2`,[post_id, userId]);

                console.log('Post Unsaved Successfully');

                await client.query('COMMIT');

                return res.status(200).json({ message: 'Post Removed Successfully' });

            }else{

            if (post.rows.length < 1){
                return res.status(404).send("We could't find the selected post");
            };

            function take_number(data){
                return data.rows.map(element => element.max).join(',');
               };

            const last_saved = await client.query(`
                SELECT max(id) FROM saved;`);
            const last_saved_id = last_saved ? take_number(last_saved) : 0 ;
            const saved_id = Number(last_saved_id) + 1; 

            await client.query(`
                INSERT INTO saved
                VALUES (
                $1, $2, $3, NOW())`,[saved_id, post_id, userId]);

            const result = await client.query(`
                SELECT * FROM saved WHERE id = $1`, [saved_id]);


            await client.query('COMMIT');

            if(result.rows.length === 0){
                return res.status(200).json([]);
              }

            res.send(result.rows);
        }
            
        } catch (err) {
            await client.query('ROLLBACK');
            res.status(500).json({error: 'server error', details: err.message});
        }finally{
            client.release();
        }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a saved post by ID
 *     description: Remove a specific saved post from the authenticated user's saved posts using the saved post's ID.
 *     tags:
 *       - Saved Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The unique identifier of the saved post to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the saved post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the saved entry.
 *                   example: 1
 *                 post_id:
 *                   type: integer
 *                   description: Unique identifier for the associated post.
 *                   example: 123
 *                 user_id:
 *                   type: integer
 *                   description: Unique identifier for the user who saved the post.
 *                   example: 789
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was saved.
 *                   example: "2025-01-25T10:20:30Z"
 *                 posts:
 *                   type: object
 *                   properties:
 *                     post_id:
 *                       type: integer
 *                       description: Unique identifier for the post.
 *                       example: 123
 *                     title:
 *                       type: string
 *                       description: Title of the post.
 *                       example: "Selling my 2018 Toyota Camry"
 *                     car_id:
 *                       type: integer
 *                       description: Unique identifier for the associated car.
 *                       example: 456
 *                     # Additional post fields can be added here
 *                 cars:
 *                   type: object
 *                   properties:
 *                     car_id:
 *                       type: integer
 *                       description: Unique identifier for the car.
 *                       example: 456
 *                     brand:
 *                       type: string
 *                       description: Brand of the car.
 *                       example: "Toyota"
 *                     model:
 *                       type: string
 *                       description: Model of the car.
 *                       example: "Camry"
 *                     year:
 *                       type: integer
 *                       description: Manufacturing year of the car.
 *                       example: 2018
 *                     price:
 *                       type: number
 *                       description: Price of the car.
 *                       example: 20000
 *                     mileage:
 *                       type: integer
 *                       description: Mileage of the car.
 *                       example: 15000
 *                     fuel:
 *                       type: string
 *                       description: Fuel type of the car.
 *                       example: "Petrol"
 *                     traction:
 *                       type: string
 *                       description: Traction type of the car.
 *                       example: "FWD"
 *                     engine_size:
 *                       type: number
 *                       description: Engine size in liters.
 *                       example: 2.5
 *                     engine_power:
 *                       type: integer
 *                       description: Engine power in HP.
 *                       example: 203
 *                     transmission:
 *                       type: string
 *                       description: Transmission type.
 *                       example: "Automatic"
 *                     color:
 *                       type: string
 *                       description: Exterior color of the car.
 *                       example: "Blue"
 *                     interior_color:
 *                       type: string
 *                       description: Interior color of the car.
 *                       example: "Black"
 *                     body:
 *                       type: string
 *                       description: Body type of the car.
 *                       example: "Sedan"
 *                     country:
 *                       type: string
 *                       description: Country where the car is located.
 *                       example: "USA"
 *                     state:
 *                       type: string
 *                       description: State where the car is located.
 *                       example: "California"
 *                     location_id:
 *                       type: integer
 *                       description: Unique identifier for the location.
 *                       example: 321
 *                     address:
 *                       type: string
 *                       description: Address of the location.
 *                       example: "1234 Elm Street"
 *                     city:
 *                       type: string
 *                       description: City of the location.
 *                       example: "Los Angeles"
 *                     location_state:
 *                       type: string
 *                       description: State of the location.
 *                       example: "California"
 *                     location_country:
 *                       type: string
 *                       description: Country of the location.
 *                       example: "USA"
 *                 locations:
 *                   type: object
 *                   properties:
 *                     location_id:
 *                       type: integer
 *                       description: Unique identifier for the location.
 *                       example: 321
 *                     address:
 *                       type: string
 *                       description: Address of the location.
 *                       example: "1234 Elm Street"
 *                     city:
 *                       type: string
 *                       description: City of the location.
 *                       example: "Los Angeles"
 *                     state:
 *                       type: string
 *                       description: State of the location.
 *                       example: "California"
 *                     country:
 *                       type: string
 *                       description: Country of the location.
 *                       example: "USA"
 *                 image_urls:
 *                   type: array
 *                   description: List of image URLs associated with the car.
 *                   items:
 *                     type: string
 *                     format: uri
 *                     example: "http://localhost:3000/images/car1.jpg"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: List of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: Error message.
 *                         example: "Invalid Saved Post Id"
 *                       param:
 *                         type: string
 *                         description: Parameter that caused the error.
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         description: Location of the parameter (e.g., path).
 *                         example: "path"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Unauthorized access. Please provide a valid token."
 *       403:
 *         description: Forbidden. The user is not authorized to delete this saved post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error type.
 *                   example: "Unauthorized"
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: "You can only delete your own posts"
 *       404:
 *         description: Saved post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "We couldn't find any saved post with this id"
 *       500:
 *         description: Internal server error during deletion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: General error message.
 *                   example: "server error"
 *                 details:
 *                   type: string
 *                   description: Additional details about the error.
 *                   example: "Detailed error message explaining what went wrong."
 */
savedRouter.delete('/:id',isAuthenticated, deleteSavedPostValidation,async (req,res)=>{
    try{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
        const savedPostId = req.params.id;
        const userId = req.user.id;

        const savedPost = await pool.query(`
            SELECT * FROM saved WHERE id = $1`,[savedPostId]);

        if (savedPost.rows.length < 1){
            return res.status(404).send("We could't find any saved post with this id");
        };

        await pool.query(`
            DELETE FROM saved WHERE id = $1 AND user_id = $2`, [savedPostId, userId]);

        res.send(savedPost.rows);
        
    }catch(err){
        res.status(500).json({error: 'server error', details: err.message})
    }
});


module.exports  = savedRouter;