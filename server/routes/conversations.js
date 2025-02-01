const express = require('express');
const router = express.Router();
const pool = require('../db');
const { body, param, validationResult } = require('express-validator');
const isAuthenticated = require('../auth');

const createConversationValidation = [
  body('buyer_id').isInt().custom(async (val, { req }) => {
    if (val !== req.user.id) throw new Error('Unauthorized');
    return true;
  }),
  body('seller_id').isInt().custom(async (val, { req }) => {
    if (val === req.body.buyer_id) throw new Error('Same buyer and seller');
    return true;
  }),
  body('seller_id').isInt().custom(async (val, { req }) => {
    const { post_id } = req.body;
    const r = await pool.query('SELECT user_id FROM posts WHERE post_id=$1', [post_id]);
    if (!r.rows.length) throw new Error('Post not found');
    if (r.rows[0].user_id !== val) throw new Error('Seller mismatch');
    if (val === req.body.buyer_id) throw new Error('Same buyer and seller');
    return true;
  }),
  body('post_id').isInt().custom(async (val) => {
    const r = await pool.query('SELECT user_id FROM posts WHERE post_id=$1', [val]);
    if (!r.rows.length) throw new Error('Post not found');
    return true;
  })
];

/**
 * @swagger
 * /buy:
 *   get:
 *     summary: Retrieve conversations where the user is the buyer
 *     description: Fetch all conversations where the authenticated user is the buyer, including related post and car details.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved buyer conversations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BuyerConversation'
 *             example:
 *               - id: 1
 *                 buyer_id: 789
 *                 seller_id: 456
 *                 post_id: 123
 *                 created_at: "2025-01-25T10:20:30Z"
 *                 post_title: "Selling my 2018 Toyota Camry"
 *                 seller_username: "sellerUser"
 *                 last_message: "Is the car still available?"
 *                 cars:
 *                   car_id: 123
 *                   brand: "Toyota"
 *                   model: "Camry"
 *                   year: 2018
 *                   price: 20000
 *                   mileage: 15000
 *                   fuel: "Petrol"
 *                   traction: "FWD"
 *                   engine_size: 2.5
 *                   engine_power: 203
 *                   transmission: "Automatic"
 *                   color: "Blue"
 *                   interior_color: "Black"
 *                   body: "Sedan"
 *                   country: "USA"
 *                   state: "California"
 *                   location_id: 321
 *                   address: "1234 Elm Street"
 *                   city: "Los Angeles"
 *                   location_state: "California"
 *                   location_country: "USA"
 *                 image_urls:
 *                   - "http://localhost:3000/images/car1.jpg"
 *                   - "http://localhost:3000/images/car2.jpg"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     BuyerConversation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the conversation.
 *         buyer_id:
 *           type: integer
 *           description: Unique identifier for the buyer.
 *         seller_id:
 *           type: integer
 *           description: Unique identifier for the seller.
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the associated post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the conversation was created.
 *         post_title:
 *           type: string
 *           description: Title of the associated post.
 *         seller_username:
 *           type: string
 *           description: Username of the seller.
 *         last_message:
 *           type: string
 *           description: The most recent message in the conversation.
 *         cars:
 *           $ref: '#/components/schemas/Car'
 *         locations:
 *           $ref: '#/components/schemas/Location'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs associated with the car.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized access. Please provide a valid token."
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
router.get('/buy', isAuthenticated, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT 
          c.id,
          c.buyer_id,
          c.seller_id,
          c.post_id,
          c.created_at,
          p.title AS post_title,
          u.username AS seller_username,
          (SELECT message FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
          cars.*,
          locations.*,
          array_agg(images.image_url) AS image_urls
        FROM conversations c
        JOIN posts p ON c.post_id = p.post_id
        JOIN users u ON c.seller_id = u.id
        LEFT JOIN cars ON cars.car_id = p.car_id
        LEFT JOIN locations ON cars.location_id = locations.location_id
        LEFT JOIN images ON images.car_id = cars.car_id
        WHERE c.buyer_id = $1
        GROUP BY 
          c.id, c.buyer_id, c.seller_id, c.post_id, c.created_at, 
          p.title, u.username, cars.car_id, locations.location_id
        ORDER BY c.created_at DESC`,
        [req.user.id]
      );
  
      const host = req.get('host');
      const protocol = req.protocol;
  
      const processedRows = r.rows.map(row => {
        let imageUrls = row.image_urls || [];
        if (!Array.isArray(imageUrls)) imageUrls = [];
        
        return {
          ...row,
          image_urls: imageUrls.map(url => `${protocol}://${host}${url}`)
        };
      });
  
      res.json(processedRows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /sell:
 *   get:
 *     summary: Retrieve conversations where the user is the seller
 *     description: Fetch all conversations where the authenticated user is the seller, including related post and car details.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved seller conversations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SellerConversation'
 *             example:
 *               - id: 2
 *                 buyer_id: 789
 *                 seller_id: 456
 *                 post_id: 124
 *                 created_at: "2025-01-26T11:30:45Z"
 *                 post_title: "Selling my 2020 Honda Civic"
 *                 buyer_username: "buyerUser"
 *                 last_message: "Can I schedule a viewing?"
 *                 cars:
 *                   car_id: 124
 *                   brand: "Honda"
 *                   model: "Civic"
 *                   year: 2020
 *                   price: 22000
 *                   mileage: 10000
 *                   fuel: "Petrol"
 *                   traction: "FWD"
 *                   engine_size: 2.0
 *                   engine_power: 158
 *                   transmission: "Manual"
 *                   color: "Red"
 *                   interior_color: "Gray"
 *                   body: "Sedan"
 *                   country: "USA"
 *                   state: "Texas"
 *                   location_id: 322
 *                   address: "5678 Oak Avenue"
 *                   city: "Houston"
 *                   location_state: "Texas"
 *                   location_country: "USA"
 *                 image_urls:
 *                   - "http://localhost:3000/images/car3.jpg"
 *                   - "http://localhost:3000/images/car4.jpg"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     SellerConversation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the conversation.
 *         buyer_id:
 *           type: integer
 *           description: Unique identifier for the buyer.
 *         seller_id:
 *           type: integer
 *           description: Unique identifier for the seller.
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the associated post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the conversation was created.
 *         post_title:
 *           type: string
 *           description: Title of the associated post.
 *         buyer_username:
 *           type: string
 *           description: Username of the buyer.
 *         last_message:
 *           type: string
 *           description: The most recent message in the conversation.
 *         cars:
 *           $ref: '#/components/schemas/Car'
 *         locations:
 *           $ref: '#/components/schemas/Location'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs associated with the car.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized access. Please provide a valid token."
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
  router.get('/sell', isAuthenticated, async (req, res) => {
    try {
      const r = await pool.query(
        `SELECT 
          c.id,
          c.buyer_id,
          c.seller_id,
          c.post_id,
          c.created_at,
          p.title AS post_title,
          u.username AS buyer_username,
          (SELECT message FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
          cars.*,
          locations.*,
          array_agg(images.image_url) AS image_urls
        FROM conversations c
        JOIN posts p ON c.post_id = p.post_id
        JOIN users u ON c.buyer_id = u.id
        LEFT JOIN cars ON cars.car_id = p.car_id
        LEFT JOIN locations ON cars.location_id = locations.location_id
        LEFT JOIN images ON images.car_id = cars.car_id
        WHERE c.seller_id = $1
        GROUP BY 
          c.id, c.buyer_id, c.seller_id, c.post_id, c.created_at, 
          p.title, u.username, cars.car_id, locations.location_id
        ORDER BY c.created_at DESC`,
        [req.user.id]
      );
  
      const host = req.get('host');
      const protocol = req.protocol;
  
      const processedRows = r.rows.map(row => {
        let imageUrls = row.image_urls || [];
        if (!Array.isArray(imageUrls)) imageUrls = [];
        
        return {
          ...row,
          image_urls: imageUrls.map(url => `${protocol}://${host}${url}`)
        };
      });
  
      res.json(processedRows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new conversation
 *     description: Initiate a new conversation between a buyer and a seller regarding a specific post.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyer_id
 *               - seller_id
 *               - post_id
 *             properties:
 *               buyer_id:
 *                 type: integer
 *                 description: Unique identifier for the buyer.
 *                 example: 789
 *               seller_id:
 *                 type: integer
 *                 description: Unique identifier for the seller.
 *                 example: 456
 *               post_id:
 *                 type: integer
 *                 description: Unique identifier for the associated post.
 *                 example: 123
 *           example:
 *             buyer_id: 789
 *             seller_id: 456
 *             post_id: 123
 *     responses:
 *       201:
 *         description: Successfully created a new conversation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *             example:
 *               id: 1
 *               buyer_id: 789
 *               seller_id: 456
 *               post_id: 123
 *               created_at: "2025-01-25T10:20:30Z"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Unauthorized"
 *                   param: "buyer_id"
 *                   location: "body"
 *                 - msg: "Post not found"
 *                   param: "post_id"
 *                   location: "body"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       500:
 *         description: Internal server error during conversation creation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the conversation.
 *         buyer_id:
 *           type: integer
 *           description: Unique identifier for the buyer.
 *         seller_id:
 *           type: integer
 *           description: Unique identifier for the seller.
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the associated post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the conversation was created.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized access. Please provide a valid token."
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 description: Error message.
 *               param:
 *                 type: string
 *                 description: Parameter that caused the error.
 *               location:
 *                 type: string
 *                 description: Location of the parameter (e.g., body, query).
 */
router.post('/', isAuthenticated, createConversationValidation, async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { buyer_id, seller_id, post_id } = req.body;
    await client.query('BEGIN');
    const e = await client.query(
      'SELECT id FROM conversations WHERE buyer_id=$1 AND seller_id=$2 AND post_id=$3',
      [buyer_id, seller_id, post_id]
    );
    if (e.rows.length) {
      await client.query('COMMIT');
      return res.json(e.rows[0]);
    }
    const r = await client.query(
      'INSERT INTO conversations (buyer_id,seller_id,post_id,created_at) VALUES ($1,$2,$3,NOW()) RETURNING *',
      [buyer_id, seller_id, post_id]
    );
    await client.query('COMMIT');
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error('Conversation creation error:', err);
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /{id}/messages:
 *   get:
 *     summary: Retrieve messages for a specific conversation
 *     description: Fetch all messages within a specific conversation that the authenticated user is a part of.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The unique identifier of the conversation.
 *     responses:
 *       200:
 *         description: Successfully retrieved messages for the conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *             example:
 *               - id: 1
 *                 conversation_id: 1
 *                 sender_id: 789
 *                 message: "Is the car still available?"
 *                 created_at: "2025-01-25T10:25:30Z"
 *                 sender_username: "buyerUser"
 *               - id: 2
 *                 conversation_id: 1
 *                 sender_id: 456
 *                 message: "Yes, it's still available."
 *                 created_at: "2025-01-25T10:26:45Z"
 *                 sender_username: "sellerUser"
 *       403:
 *         description: Forbidden. The user is not part of the conversation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *       404:
 *         description: Conversation not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Conversation not found."
 *       500:
 *         description: Internal server error while retrieving messages.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the message.
 *         conversation_id:
 *           type: integer
 *           description: Unique identifier for the conversation.
 *         sender_id:
 *           type: integer
 *           description: Unique identifier for the sender.
 *         message:
 *           type: string
 *           description: The message content.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was created.
 *         sender_username:
 *           type: string
 *           description: Username of the sender.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
router.get('/:id/messages', isAuthenticated, async (req, res) => {
  try {
    const c = await pool.query(
      'SELECT * FROM conversations WHERE id=$1 AND (buyer_id=$2 OR seller_id=$2)',
      [req.params.id, req.user.id]
    );
    if (!c.rows.length) return res.status(403).json({ error: 'Unauthorized' });
    const m = await pool.query(
      `SELECT m.id,m.conversation_id,m.sender_id,m.message,m.created_at,u.username AS sender_username
       FROM messages m
       JOIN users u ON m.sender_id=u.id
       WHERE m.conversation_id=$1
       ORDER BY m.created_at ASC`,
      [req.params.id]
    );
    res.json(m.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a specific conversation
 *     description: Delete a specific conversation and all related messages if the authenticated user is a participant.
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The unique identifier of the conversation to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the conversation and related messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Successfully deleted car and all related data"
 *                 deletedCar:
 *                   $ref: '#/components/schemas/Car'
 *             example:
 *               message: "Successfully deleted car and all related data"
 *               deletedCar:
 *                 car_id: 123
 *                 brand: "Toyota"
 *                 model: "Camry"
 *                 year: 2018
 *                 price: 20000
 *                 mileage: 15000
 *                 fuel: "Petrol"
 *                 traction: "FWD"
 *                 engine_size: 2.5
 *                 engine_power: 203
 *                 transmission: "Automatic"
 *                 color: "Blue"
 *                 interior_color: "Black"
 *                 body: "Sedan"
 *                 country: "USA"
 *                 state: "California"
 *                 location_id: 321
 *                 address: "1234 Elm Street"
 *                 city: "Los Angeles"
 *                 location_state: "California"
 *                 location_country: "USA"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Invalid car ID"
 *                   param: "id"
 *                   location: "path"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       403:
 *         description: Forbidden. The user is not authorized to delete this conversation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *               message: "You can only delete your own posts"
 *       404:
 *         description: Conversation not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Car not found!"
 *       500:
 *         description: Internal server error during conversation deletion.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car.
 *           example: 123
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *           example: "Toyota"
 *         model:
 *           type: string
 *           description: Model of the car.
 *           example: "Camry"
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *           example: 2018
 *         price:
 *           type: number
 *           description: Price of the car.
 *           example: 20000
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *           example: 15000
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *           example: "Petrol"
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *           example: "FWD"
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *           example: 2.5
 *         engine_power:
 *           type: number
 *           description: Engine power in HP.
 *           example: 203
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *           example: "Automatic"
 *         color:
 *           type: string
 *           description: Exterior color of the car.
 *           example: "Blue"
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *           example: "Black"
 *         body:
 *           type: string
 *           description: Body type of the car.
 *           example: "Sedan"
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *           example: "USA"
 *         state:
 *           type: string
 *           description: State where the car is located.
 *           example: "California"
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the location.
 *           example: 321
 *         address:
 *           type: string
 *           description: Address of the location.
 *           example: "1234 Elm Street"
 *         city:
 *           type: string
 *           description: City of the location.
 *           example: "Los Angeles"
 *         location_state:
 *           type: string
 *           description: State of the location.
 *           example: "California"
 *         location_country:
 *           type: string
 *           description: Country of the location.
 *           example: "USA"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Unauthorized"
 *         message:
 *           type: string
 *           description: Additional message detailing the error.
 *           example: "You can only delete your own posts"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 description: Error message.
 *               param:
 *                 type: string
 *                 description: Parameter that caused the error.
 *               location:
 *                 type: string
 *                 description: Location of the parameter (e.g., body, query).
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
  const client = await pool.connect();
  try {
    const c = await client.query(
      'SELECT * FROM conversations WHERE id=$1 AND (buyer_id=$2 OR seller_id=$2)',
      [req.params.id, req.user.id]
    );
    if (!c.rows.length) return res.status(403).json({ error: 'Unauthorized' });
    await client.query('BEGIN');
    await client.query('DELETE FROM messages WHERE conversation_id=$1', [req.params.id]);
    const r = await client.query('DELETE FROM conversations WHERE id=$1 RETURNING *', [req.params.id]);
    await client.query('COMMIT');
    res.json(r.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
