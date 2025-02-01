const express = require('express');
const carsRouter = express.Router();
const pool = require('../db');
const {body, param, validationResult} = require('express-validator');
const isAuthenticated = require('../auth');
const upload = require('../multerConfig');
const path = require('path');
const fs = require('fs');
  
const createPostValidation = [
        body('status').isString().notEmpty().withMessage('Status must not be Empty'),

        body('city').isString().notEmpty().withMessage('City must not be Empty'),

        body('state').isString().notEmpty().withMessage('State must not be empty'),

        body('title').isString().isLength({min: 5}).withMessage('Title must be at least 10 characters long'),

        body('zip_code').isPostalCode('any').withMessage('Invalid postal code')
        .notEmpty().withMessage('Postal code must not be empty'),

        body('country').isString().notEmpty().isIn(['Romania', 'Italy']).withMessage('Country must not be empty'),

        body('street_address').isString().notEmpty().withMessage('Street address must not be empty'),

        body('year').isInt({min: 1800, max: 2025}).withMessage('Year must be between 1800 and 2025')
        .notEmpty().withMessage('Year must not be empty'),

        body('price').isFloat({min: 0}).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price must not be empty'),

        body('brand').isString().notEmpty().withMessage('Brand must not be empty'),

        body('model').isString().notEmpty().withMessage('Model must not be empty'),

        body('mileage').optional().isFloat({min: 0}).withMessage('Mileage must be a positive number'),

        body('fuel').isString().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG']).withMessage('Invalid fuel type'),

        body('traction').optional().isString().isIn(['RWD', 'FWD', 'AWD', '4WD']).withMessage('Invalid traction type'),

        body('engine_size').optional().isFloat({ min: 0 }).withMessage('Engine size must be a positive number'),

        body('engine_power').optional().isInt({ min: 0 }).withMessage('Engine power must be a positive integer'),

        body('transmission').optional().isString().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission'),

        body('color').optional().isString().withMessage('Invalid color'),

        body('interior_color').optional().isString().withMessage('Invalid interior color'),

        body('body').optional().isString().withMessage('Invalid body'),

        body('number_of_doors').optional().isInt({min: 1, max: 10}).withMessage('Invalid number of doors'),

        body('number_of_seats').optional().isInt({min: 1, max: 60}).withMessage('Invalid number of seats'),

        body('notes').optional().isString().withMessage('notes not valid')
    ];

const updatePostValidation = [
    param('id').optional().isInt().withMessage('Invalid Car Id'),

    body('status').optional().isString().withMessage('Invalid Status'),

        body('city').optional().isString().withMessage('Invalid city'),

        body('state').optional().isString().withMessage('Invalid state'),

        body('title').optional().isString().isLength({min: 5}).withMessage('Title must be at least 10 characters long'),

        body('zip_code').optional().isPostalCode('any').withMessage('Invalid postal code'),

        body('country').optional().isString().isIn(['Romania', 'Italy']).withMessage('Invalid country'),

        body('street_address').isString().notEmpty().withMessage('Street address must not be empty'),

        body('year').optional().isInt({min: 1800, max: 2025}).withMessage('Year must be between 1800 and 2025'),

        body('price').optional().isFloat({min: 0}).withMessage('Price must be a positive number'),

        body('brand').optional().isString().withMessage('Invalid brand'),

        body('model').optional().isString().withMessage('Invalid make'),

        body('mileage').optional().isFloat({min: 0}).withMessage('Mileage must be a positive number'),

        body('fuel').optional().isString().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG']).withMessage('Invalid fuel type'),

        body('traction').optional().isString().isIn(['FWD', 'RWD', 'AWD', '4WD']).withMessage('Invalid traction type'),

        body('engine_size').optional().isFloat({ min: 0 }).withMessage('Engine size must be a positive number'),

        body('engine_power').optional().isInt({ min: 0 }).withMessage('Engine power must be a positive integer'),

        body('transmission').optional().isString().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission'),

        body('color').optional().isString().withMessage('Invalid color'),

        body('interior_color').optional().isString().withMessage('Invalid interior color'),

        body('body').optional().isString().withMessage('Invalid body'),

        body('number_of_doors').optional().isInt({min: 1, max: 10}).withMessage('Invalid number of doors'),

        body('number_of_seats').optional().isInt({min: 1, max: 60}).withMessage('Invalid number of seats'),

        body('notes').optional().isString().withMessage('notes not valid'),
];

const deletePostValidaton =[
    param('id').isInt().withMessage('Invalid Car Id')
];

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Fetch cars on sale
 *     description: Retrieve a list of cars currently on sale with optional filters and pagination.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of cars to return per page.
 *       - in: query
 *         name: price_from
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter.
 *       - in: query
 *         name: price_to
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter.
 *       - in: query
 *         name: year_from
 *         schema:
 *           type: integer
 *           minimum: 1886
 *         description: Minimum manufacturing year.
 *       - in: query
 *         name: year_to
 *         schema:
 *           type: integer
 *           minimum: 1886
 *         description: Maximum manufacturing year.
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Brand name (supports partial matching).
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Model name (supports partial matching).
 *       - in: query
 *         name: mileage_from
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum mileage.
 *       - in: query
 *         name: mileage_to
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum mileage.
 *       - in: query
 *         name: fuel
 *         schema:
 *           type: string
 *           enum: [Petrol, Diesel, Electric, Hybrid, Other]
 *         description: Fuel type.
 *       - in: query
 *         name: traction
 *         schema:
 *           type: string
 *           enum: [FWD, RWD, AWD, 4WD]
 *         description: Traction type.
 *       - in: query
 *         name: engine_size_from
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum engine size in liters.
 *       - in: query
 *         name: engine_size_to
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum engine size in liters.
 *       - in: query
 *         name: engine_power_from
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum engine power in HP.
 *       - in: query
 *         name: engine_power_to
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum engine power in HP.
 *       - in: query
 *         name: transmission
 *         schema:
 *           type: string
 *           enum: [Manual, Automatic, Semi-Automatic, CVT, Other]
 *         description: Transmission type.
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Comma-separated list of exterior colors.
 *       - in: query
 *         name: interior_color
 *         schema:
 *           type: string
 *         description: Comma-separated list of interior colors.
 *       - in: query
 *         name: body
 *         schema:
 *           type: string
 *           enum: [Sedan, SUV, Hatchback, Coupe, Convertible, Wagon, Van, Truck, Other]
 *         description: Body type of the car.
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country where the car is located.
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State where the car is located.
 *     responses:
 *       200:
 *         description: A list of cars matching the filters with pagination details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of cars matching the filters.
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages.
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number.
 *                     perPage:
 *                       type: integer
 *                       description: Number of cars per page.
 *       404:
 *         description: No cars found matching the provided filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No cars found matching the filters."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Error message detailing what went wrong."
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car.
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *         model:
 *           type: string
 *           description: Model of the car.
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *         price:
 *           type: number
 *           description: Price of the car.
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *         engine_power:
 *           type: number
 *           description: Engine power in HP.
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *         color:
 *           type: string
 *           description: Exterior color of the car.
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *         body:
 *           type: string
 *           description: Body type of the car.
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *         state:
 *           type: string
 *           description: State where the car is located.
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         posts:
 *           $ref: '#/components/schemas/Post'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs for the car.
 *     Location:
 *       type: object
 *       properties:
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the location.
 *         address:
 *           type: string
 *           description: Address of the location.
 *         city:
 *           type: string
 *           description: City of the location.
 *         state:
 *           type: string
 *           description: State of the location.
 *         country:
 *           type: string
 *           description: Country of the location.
 *     Post:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the post.
 *         content:
 *           type: string
 *           description: Content of the post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created.
 */

carsRouter.get('/', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
          
      const filters = [];
      const values = [];
      let valueCount = 1;

      const {
          price_from, price_to,
          year_from, year_to,
          brand, model,
          mileage_from, mileage_to,
          fuel, traction,
          engine_size_from, engine_size_to,
          engine_power_from, engine_power_to,
          transmission,
          color, interior_color,
          body,
          country, state
      } = req.query;

      if (price_from) {
          filters.push(`price >= $${valueCount++}`);
          values.push(price_from);
      }
      if (price_to) {
          filters.push(`price <= $${valueCount++}`);
          values.push(price_to);
      }
      if (year_from) {
          filters.push(`year >= $${valueCount++}`);
          values.push(year_from);
      }
      if (year_to) {
          filters.push(`year <= $${valueCount++}`);
          values.push(year_to);
      }
      if (brand) {
          filters.push(`brand ILIKE $${valueCount++}`);
          values.push(`%${brand}%`); 
      }
      if (model) {
          filters.push(`model ILIKE $${valueCount++}`);
          values.push(`%${model}%`);
      }
      if (mileage_from) {
          filters.push(`mileage >= $${valueCount++}`);
          values.push(mileage_from);
      }
      if (mileage_to) {
          filters.push(`mileage <= $${valueCount++}`);
          values.push(mileage_to);
      }
      if (fuel) {
          filters.push(`fuel = $${valueCount++}`);
          values.push(fuel);
      }
      if (traction) {
          filters.push(`traction = $${valueCount++}`);
          values.push(traction);
      }
      if (engine_size_from) {
          filters.push(`engine_size >= $${valueCount++}`);
          values.push(engine_size_from);
      }
      if (engine_size_to) {
          filters.push(`engine_size <= $${valueCount++}`);
          values.push(engine_size_to);
      }
      if (engine_power_from) {
          filters.push(`engine_power >= $${valueCount++}`);
          values.push(engine_power_from);
      }
      if (engine_power_to) {
          filters.push(`engine_power <= $${valueCount++}`);
          values.push(engine_power_to);
      }
      if (transmission) {
          filters.push(`transmission = $${valueCount++}`);
          values.push(transmission);
      }
      if (color) {
          const colorsArray = color.split(',');
          filters.push(`color = ANY($${valueCount++}::text[])`);
          values.push(colorsArray);
      }
      if (interior_color) {
          const interiorColorsArray = interior_color.split(',');
          filters.push(`interior_color = ANY($${valueCount++}::text[])`);
          values.push(interiorColorsArray);
      }
      if (body) {
          filters.push(`body = $${valueCount++}`);
          values.push(body);
      }
      if (country) {
          filters.push(`country = $${valueCount++}`);
          values.push(country);
      }
      if (state) {
          filters.push(`state = $${valueCount++}`);
          values.push(state);
      }

      const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

      const queryText = `
          SELECT 
              cars.*, 
              locations.*, 
              posts.*, 
              array_agg(images.image_url) AS image_urls
          FROM cars 
          LEFT JOIN images ON images.car_id = cars.car_id
          LEFT JOIN locations ON cars.location_id = locations.location_id
          LEFT JOIN posts ON posts.car_id = cars.car_id
          ${whereClause}
          GROUP BY cars.car_id, locations.location_id, posts.post_id
          ORDER BY cars.car_id DESC
          LIMIT $${valueCount++} OFFSET $${valueCount++};
      `;
      values.push(limit, offset);

      const query = await pool.query(queryText, values);

      const countQueryText = `
          SELECT COUNT(DISTINCT cars.car_id) AS total
          FROM cars 
          LEFT JOIN locations ON cars.location_id = locations.location_id
          LEFT JOIN posts ON posts.car_id = cars.car_id
          ${whereClause};
      `;
      const countQuery = await pool.query(countQueryText, values.slice(0, valueCount - 3)); 

      const totalCount = parseInt(countQuery.rows[0].total, 10);
      const totalPages = Math.ceil(totalCount / limit);

      if (query.rows.length === 0) {
          return res.status(404).json({ error: 'No cars found matching the filters.' });
      }

      const host = req.get('host');
      const protocol = req.protocol;

      const transformedRows = query.rows.map(row => ({
          ...row,
          image_urls: row.image_urls && row.image_urls[0] !== null
              ? row.image_urls.map(url => `${protocol}://${host}${url}`)
              : []
      }));

      res.json({
          data: transformedRows,
          pagination: {
              total: totalCount,
              totalPages,
              currentPage: page,
              perPage: limit
          }
      });
  } catch (err) {
      console.error('Error fetching cars:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @swagger
 * /cars/my-posts:
 *   get:
 *     summary: Retrieve authenticated user's posts
 *     description: Fetch all posts created by the authenticated user, including details about the cars, their locations, and associated images.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the authenticated user's posts with related car and location details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPost'
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserPost:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the post.
 *         user_id:
 *           type: integer
 *           description: Unique identifier for the user who created the post.
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car associated with the post.
 *         content:
 *           type: string
 *           description: Content or description of the post.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created.
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was last updated.
 *         car:
 *           $ref: '#/components/schemas/Car'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs associated with the car.
 *     Car:
 *       type: object
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car.
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *         model:
 *           type: string
 *           description: Model of the car.
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *         price:
 *           type: number
 *           description: Price of the car.
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *         engine_power:
 *           type: number
 *           description: Engine power in HP.
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *         color:
 *           type: string
 *           description: Exterior color of the car.
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *         body:
 *           type: string
 *           description: Body type of the car.
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *         state:
 *           type: string
 *           description: State where the car is located.
 *     Location:
 *       type: object
 *       properties:
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the location.
 *         address:
 *           type: string
 *           description: Address of the location.
 *         city:
 *           type: string
 *           description: City of the location.
 *         state:
 *           type: string
 *           description: State of the location.
 *         country:
 *           type: string
 *           description: Country of the location.
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 */
carsRouter.get('/my-posts', isAuthenticated, async (req, res) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');

      const userId = req.user.id;

      const userPosts = await client.query(`
          SELECT 
              posts.*,
              cars.*,
              locations.*,
              array_agg(images.image_url) as image_urls
          FROM posts
          LEFT JOIN cars
              ON cars.car_id = posts.car_id
          LEFT JOIN locations 
              ON cars.location_id = locations.location_id
          LEFT JOIN images
              ON images.car_id = cars.car_id
          WHERE posts.user_id = $1
          GROUP BY 
              posts.post_id,
              cars.car_id,
              locations.location_id
          ORDER BY posts.created_at DESC;
      `, [userId]);

      const host = req.get('host');
      const protocol = req.protocol;

      const transformedPosts = userPosts.rows.map(post => ({
          ...post,
          image_urls: post.image_urls && post.image_urls[0] !== null
              ? post.image_urls.map(url => `${protocol}://${host}${url}`)
              : []
      }));

      await client.query('COMMIT');
      res.json(transformedPosts); 

  } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error fetching my posts:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
      client.release();
  }
});

/**
 * @swagger
 * /cars/my-posts/{id}:
 *   get:
 *     summary: Retrieve a specific car post by ID for the authenticated user
 *     description: Fetch detailed information about a specific car post, including car details, location, and associated images, for the authenticated user.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the car to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the car post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPost'
 *             example:
 *               - post_id: 456
 *                 user_id: 789
 *                 car_id: 123
 *                 content: "Selling my 2018 Toyota Camry with low mileage."
 *                 created_at: "2025-01-25T10:20:30Z"
 *                 updated_at: "2025-01-26T12:00:00Z"
 *                 car:
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
 *                 location:
 *                   location_id: 321
 *                   address: "1234 Elm Street"
 *                   city: "Los Angeles"
 *                   state: "California"
 *                   country: "USA"
 *                 image_urls:
 *                   - "http://localhost:3000/images/car1.jpg"
 *                   - "http://localhost:3000/images/car2.jpg"
 *       404:
 *         description: No car found with the specified ID for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "No car found with id: 123"
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserPost:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the post.
 *           example: 456
 *         user_id:
 *           type: integer
 *           description: Unique identifier for the user who created the post.
 *           example: 789
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car associated with the post.
 *           example: 123
 *         content:
 *           type: string
 *           description: Content or description of the post.
 *           example: "Selling my 2018 Toyota Camry with low mileage."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created.
 *           example: "2025-01-25T10:20:30Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was last updated.
 *           example: "2025-01-26T12:00:00Z"
 *         car:
 *           $ref: '#/components/schemas/Car'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs associated with the car.
 *           example:
 *             - "http://localhost:3000/images/car1.jpg"
 *             - "http://localhost:3000/images/car2.jpg"
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
 *     Location:
 *       type: object
 *       properties:
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
 *         state:
 *           type: string
 *           description: State of the location.
 *           example: "California"
 *         country:
 *           type: string
 *           description: Country of the location.
 *           example: "USA"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "No car found with id: 123"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
carsRouter.get('/my-posts/:id', isAuthenticated,async (req,res)=>{
  try{
      const id = req.params.id;
      const userId = req.user.id;
      const car = await pool.query(
          `SELECT 
           cars.*, 
           locations.*, 
           posts.*, 
           array_agg(images.image_url) AS image_urls
           FROM cars 
           LEFT JOIN images ON images.car_id = cars.car_id
           LEFT JOIN locations ON cars.location_id = locations.location_id
           LEFT JOIN posts ON posts.car_id = cars.car_id
           WHERE cars.car_id = $1 AND posts.user_id = $2
           GROUP BY cars.car_id, locations.location_id, posts.post_id;`, [id,userId]
      );
      if (car.rows.length === 0) {
        return res.status(404).json({ error: `No car found with id: ${id}` });
      }

      const host = req.get('host');
      const protocol = req.protocol;
      let imageUrls = car.rows[0].image_urls || [];
      if (!Array.isArray(imageUrls)) imageUrls = [];
      const imagesWithFullPath = imageUrls.map(url => `${protocol}://${host}${url}`);
      
      car.rows[0].image_urls = imagesWithFullPath; 
      res.json(car.rows);

  }catch(err){
      res.status(500).json({error: 'Server error', details: err.message});
  }
});

/**
 * @swagger
 * /cars/conversation-post/{id}:
 *   get:
 *     summary: Retrieve a specific conversation post by ID for the authenticated user
 *     description: Fetch detailed information about a specific conversation post, including car details, location, and associated images, for the authenticated user.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the conversation post to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the conversation post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserPost'
 *             example:
 *               - post_id: 456
 *                 user_id: 789
 *                 car_id: 123
 *                 content: "Selling my 2018 Toyota Camry with low mileage."
 *                 created_at: "2025-01-25T10:20:30Z"
 *                 updated_at: "2025-01-26T12:00:00Z"
 *                 car:
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
 *                 location:
 *                   location_id: 321
 *                   address: "1234 Elm Street"
 *                   city: "Los Angeles"
 *                   state: "California"
 *                   country: "USA"
 *                 image_urls:
 *                   - "http://localhost:3000/images/car1.jpg"
 *                   - "http://localhost:3000/images/car2.jpg"
 *       404:
 *         description: No conversation post found with the specified ID for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "No car found with id: 123"
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserPost:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the post.
 *           example: 456
 *         user_id:
 *           type: integer
 *           description: Unique identifier for the user who created the post.
 *           example: 789
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car associated with the post.
 *           example: 123
 *         content:
 *           type: string
 *           description: Content or description of the post.
 *           example: "Selling my 2018 Toyota Camry with low mileage."
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created.
 *           example: "2025-01-25T10:20:30Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was last updated.
 *           example: "2025-01-26T12:00:00Z"
 *         car:
 *           $ref: '#/components/schemas/Car'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: List of image URLs associated with the car.
 *           example:
 *             - "http://localhost:3000/images/car1.jpg"
 *             - "http://localhost:3000/images/car2.jpg"
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
 *     Location:
 *       type: object
 *       properties:
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
 *         state:
 *           type: string
 *           description: State of the location.
 *           example: "California"
 *         country:
 *           type: string
 *           description: Country of the location.
 *           example: "USA"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "No car found with id: 123"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
carsRouter.get('/conversation-post/:id', isAuthenticated,async (req,res)=>{
    try{
        const id = req.params.id;
        const userId = req.user.id;
        const car = await pool.query(
            `SELECT 
             cars.*, 
             locations.*, 
             posts.*, 
             array_agg(images.image_url) AS image_urls
             FROM posts 
             LEFT JOIN cars ON cars.car_id = posts.car_id
             LEFT JOIN images ON images.car_id = cars.car_id
             LEFT JOIN locations ON cars.location_id = locations.location_id
             WHERE posts.post_id = $1 AND posts.user_id = $2
             GROUP BY cars.car_id, locations.location_id, posts.post_id;`, [id,userId]
        );
        if (car.rows.length === 0) {
          return res.status(404).json({ error: `No car found with id: ${id}` });
        }
  
        const host = req.get('host');
        const protocol = req.protocol;
        let imageUrls = car.rows[0].image_urls || [];
        if (!Array.isArray(imageUrls)) imageUrls = [];
        const imagesWithFullPath = imageUrls.map(url => `${protocol}://${host}${url}`);
        
        car.rows[0].image_urls = imagesWithFullPath; 
        res.json(car.rows);
  
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
  });
  
/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Retrieve a specific car by ID
 *     description: Fetch detailed information about a specific car, including car details, location, posts, and associated images.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the car to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the car details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *             example:
 *               car_id: 123
 *               brand: "Toyota"
 *               model: "Camry"
 *               year: 2018
 *               price: 20000
 *               mileage: 15000
 *               fuel: "Petrol"
 *               traction: "FWD"
 *               engine_size: 2.5
 *               engine_power: 203
 *               transmission: "Automatic"
 *               color: "Blue"
 *               interior_color: "Black"
 *               body: "Sedan"
 *               country: "USA"
 *               state: "California"
 *               location_id: 321
 *               address: "1234 Elm Street"
 *               city: "Los Angeles"
 *               location_state: "California"
 *               location_country: "USA"
 *               posts:
 *                 post_id: 456
 *                 user_id: 789
 *                 car_id: 123
 *                 content: "Selling my 2018 Toyota Camry with low mileage."
 *                 created_at: "2025-01-25T10:20:30Z"
 *                 updated_at: "2025-01-26T12:00:00Z"
 *               image_urls:
 *                 - "http://localhost:3000/images/car1.jpg"
 *                 - "http://localhost:3000/images/car2.jpg"
 *       404:
 *         description: Car not found with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "We couldn't find the car with the id number: 123"
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
 *     CarDetails:
 *       type: object
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car.
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *         model:
 *           type: string
 *           description: Model of the car.
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *         price:
 *           type: number
 *           description: Price of the car.
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *         engine_power:
 *           type: number
 *           description: Engine power in HP.
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *         color:
 *           type: string
 *           description: Exterior color of the car.
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *         body:
 *           type: string
 *           description: Body type of the car.
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *         state:
 *           type: string
 *           description: State where the car is located.
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the location.
 *         address:
 *           type: string
 *           description: Address of the location.
 *         city:
 *           type: string
 *           description: City of the location.
 *         location_state:
 *           type: string
 *           description: State of the location.
 *         location_country:
 *           type: string
 *           description: Country of the location.
 *         posts:
 *           type: object
 *           properties:
 *             post_id:
 *               type: integer
 *               description: Unique identifier for the post.
 *             user_id:
 *               type: integer
 *               description: Unique identifier for the user who created the post.
 *             car_id:
 *               type: integer
 *               description: Unique identifier for the car associated with the post.
 *             content:
 *               type: string
 *               description: Content or description of the post.
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the post was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the post was last updated.
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
 *           example: "We couldn't find the car with the id number: 123"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
carsRouter.get('/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        const car = await pool.query(
            `SELECT 
             cars.*, 
             locations.*, 
             posts.*, 
             array_agg(images.image_url) AS image_urls
             FROM cars 
             LEFT JOIN images ON images.car_id = cars.car_id
             LEFT JOIN locations ON cars.location_id = locations.location_id
             LEFT JOIN posts ON posts.car_id = cars.car_id
             WHERE cars.car_id = $1
             GROUP BY cars.car_id, locations.location_id, posts.post_id;`, [id]
        );
        if(car.length === 0){
            return res.status(404).json({error: `We couldn\'t fint the car with the id number: ${id}`})
        };

        const host = req.get('host');
        const protocol = req.protocol;
        let imageUrls = car.rows[0].image_urls || [];
        if (!Array.isArray(imageUrls)) imageUrls = [];
        const imagesWithFullPath = imageUrls.map(url => `${protocol}://${host}${url}`);

        car.rows[0].image_urls = imagesWithFullPath;

        res.json(car.rows[0]);
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car post
 *     description: Create a new post for a car listing, including uploading up to 10 images.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - city
 *               - state
 *               - zip_code
 *               - country
 *               - year
 *               - price
 *               - brand
 *               - model
 *               - mileage
 *               - fuel
 *               - traction
 *               - engine_size
 *               - engine_power
 *               - transmission
 *               - color
 *               - interior_color
 *               - body
 *               - number_of_doors
 *               - number_of_seats
 *               - street_address
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post.
 *                 example: "Selling my 2018 Toyota Camry"
 *               status:
 *                 type: string
 *                 description: Status of the car (e.g., Available, Sold).
 *                 example: "Available"
 *               city:
 *                 type: string
 *                 description: City where the car is located.
 *                 example: "Los Angeles"
 *               state:
 *                 type: string
 *                 description: State where the car is located.
 *                 example: "California"
 *               zip_code:
 *                 type: string
 *                 description: ZIP code of the car's location.
 *                 example: "90001"
 *               country:
 *                 type: string
 *                 description: Country where the car is located.
 *                 example: "USA"
 *               year:
 *                 type: integer
 *                 description: Manufacturing year of the car.
 *                 example: 2018
 *               price:
 *                 type: number
 *                 description: Price of the car.
 *                 example: 20000
 *               brand:
 *                 type: string
 *                 description: Brand of the car.
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 description: Model of the car.
 *                 example: "Camry"
 *               mileage:
 *                 type: integer
 *                 description: Mileage of the car.
 *                 example: 15000
 *               fuel:
 *                 type: string
 *                 description: Fuel type of the car.
 *                 example: "Petrol"
 *               traction:
 *                 type: string
 *                 description: Traction type of the car.
 *                 example: "FWD"
 *               engine_size:
 *                 type: number
 *                 description: Engine size in liters.
 *                 example: 2.5
 *               engine_power:
 *                 type: number
 *                 description: Engine power in HP.
 *                 example: 203
 *               transmission:
 *                 type: string
 *                 description: Transmission type.
 *                 example: "Automatic"
 *               color:
 *                 type: string
 *                 description: Exterior color of the car.
 *                 example: "Blue"
 *               interior_color:
 *                 type: string
 *                 description: Interior color of the car.
 *                 example: "Black"
 *               body:
 *                 type: string
 *                 description: Body type of the car.
 *                 example: "Sedan"
 *               number_of_doors:
 *                 type: integer
 *                 description: Number of doors the car has.
 *                 example: 4
 *               number_of_seats:
 *                 type: integer
 *                 description: Number of seats in the car.
 *                 example: 5
 *               notes:
 *                 type: string
 *                 description: Additional notes or description.
 *                 example: "Well-maintained with no accidents."
 *               street_address:
 *                 type: string
 *                 description: Street address of the car's location.
 *                 example: "1234 Elm Street"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 10 images of the car.
 *     responses:
 *       201:
 *         description: Successfully created a new car post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarPost'
 *             example:
 *               post_id: 456
 *               user_id: 789
 *               car_id: 123
 *               title: "Selling my 2018 Toyota Camry"
 *               status: "Available"
 *               created_at: "2025-01-25T10:20:30Z"
 *               cars:
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
 *               locations:
 *                 location_id: 321
 *                 address: "1234 Elm Street"
 *                 city: "Los Angeles"
 *                 state: "California"
 *                 country: "USA"
 *               image_urls:
 *                 - "http://localhost:3000/uploads/image1.jpg"
 *                 - "http://localhost:3000/uploads/image2.jpg"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Title is required"
 *                   param: "title"
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
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Server error"
 *               details: "Detailed error message explaining what went wrong."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CarPost:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: Unique identifier for the post.
 *         user_id:
 *           type: integer
 *           description: Unique identifier for the user who created the post.
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car associated with the post.
 *         title:
 *           type: string
 *           description: Title of the post.
 *         status:
 *           type: string
 *           description: Status of the car (e.g., Available, Sold).
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the post was created.
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
carsRouter.post('/',isAuthenticated,upload.array('images', 10),createPostValidation,async (req, res) => {
      const client = await pool.connect();
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          if (req.files) {
            req.files.forEach((file) => {
              fs.unlinkSync(file.path);
            });
          }
          return res.status(400).json({ errors: errors.array() });
        }
  
        const {
          title,status,city,state,zip_code,country,year,price,brand,model,mileage,
          fuel,traction,engine_size,engine_power,transmission,color,interior_color,
          body,number_of_doors,number_of_seats,notes,street_address,
        } = req.body;
  
        const user_id = req.user.id;
  
        await client.query('BEGIN');
  
        const locationResult = await client.query(
          `INSERT INTO locations (city, state, zip_code, country, street_address)
           VALUES ($1, $2, $3, $4, $5) RETURNING location_id;`,
          [city, state, zip_code, country, street_address]
        );
        const location_id = locationResult.rows[0].location_id;
  
        const carResult = await client.query(
          `INSERT INTO cars (location_id, year, price, brand, mileage, fuel, traction, engine_size, engine_power, transmission, color, interior_color, body, number_of_doors, number_of_seats, notes, model)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING car_id;`,
          [
            location_id,year,price,brand,mileage,fuel,traction,engine_size,
            engine_power,transmission,color,interior_color,body,number_of_doors,
            number_of_seats,notes,model,
          ]
        );
        const car_id = carResult.rows[0].car_id;
  
        const postResult = await client.query(
          `INSERT INTO posts (title, user_id, car_id, status, created_at)
           VALUES ($1, $2, $3, $4, NOW()) RETURNING post_id;`,
          [title, user_id, car_id, status]
        );

        const post_id = postResult.rows[0].post_id;
  
        if (req.files && req.files.length > 0) {
          const imagePromises = req.files.map((file) =>
            client.query(
              `INSERT INTO images (car_id, image_url)
               VALUES ($1, $2);`,
              [car_id, `/uploads/${path.basename(file.path)}`]
            )
          );
          await Promise.all(imagePromises);
        }
  
        await client.query('COMMIT');
  
        const createdPost = await client.query(
          `SELECT 
             posts.*, 
             cars.*, 
             locations.*, 
             array_agg(images.image_url) AS image_urls
           FROM posts
           JOIN cars ON posts.car_id = cars.car_id
           JOIN locations ON cars.location_id = locations.location_id
           LEFT JOIN images ON images.car_id = cars.car_id
           WHERE posts.post_id = $1
           GROUP BY posts.post_id, cars.car_id, locations.location_id;`,
          [post_id]
        );
  
        res.status(201).json(createdPost.rows[0]);
      } catch (err) {
        await client.query('ROLLBACK');
  
        if (req.files) {
          req.files.forEach((file) => {
            fs.unlinkSync(file.path);
          });
        }
  
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
      } finally {
        client.release();
      }
    }
  );

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update a specific car post by ID
 *     description: Update the details of a specific car post, including car and location information.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the car post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCarPost'
 *           example:
 *             title: "Updated Title for Car Post"
 *             status: "Sold"
 *             city: "San Francisco"
 *             state: "California"
 *             zip_code: "94105"
 *             country: "USA"
 *             year: 2019
 *             price: 22000
 *             brand: "Toyota"
 *             model: "Camry"
 *             mileage: 14000
 *             fuel: "Petrol"
 *             traction: "FWD"
 *             engine_size: 2.5
 *             engine_power: 203
 *             transmission: "Automatic"
 *             color: "Red"
 *             interior_color: "Black"
 *             body: "Sedan"
 *             number_of_doors: 4
 *             number_of_seats: 5
 *             notes: "Updated notes for the car."
 *     responses:
 *       200:
 *         description: Successfully updated the car post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *             example:
 *               car_id: 123
 *               brand: "Toyota"
 *               model: "Camry"
 *               year: 2019
 *               price: 22000
 *               mileage: 14000
 *               fuel: "Petrol"
 *               traction: "FWD"
 *               engine_size: 2.5
 *               engine_power: 203
 *               transmission: "Automatic"
 *               color: "Red"
 *               interior_color: "Black"
 *               body: "Sedan"
 *               country: "USA"
 *               state: "California"
 *               location_id: 321
 *               address: "1234 Elm Street"
 *               city: "San Francisco"
 *               location_state: "California"
 *               location_country: "USA"
 *               posts:
 *                 post_id: 456
 *                 user_id: 789
 *                 car_id: 123
 *                 title: "Updated Title for Car Post"
 *                 status: "Sold"
 *                 content: "Updated content for the car post."
 *                 created_at: "2025-01-25T10:20:30Z"
 *                 updated_at: "2025-02-01T12:00:00Z"
 *               image_urls:
 *                 - "http://localhost:3000/images/car1.jpg"
 *                 - "http://localhost:3000/images/car2.jpg"
 *       400:
 *         description: Bad request due to validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               errors:
 *                 - msg: "Price must be a positive number"
 *                   param: "price"
 *                   location: "body"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       403:
 *         description: Forbidden. You can only update your own posts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *               message: "You can only delete your own posts"
 *       404:
 *         description: Car post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Car not found"
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
 *     UpdateCarPost:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the post.
 *           example: "Updated Title for Car Post"
 *         status:
 *           type: string
 *           description: Status of the car (e.g., Available, Sold).
 *           example: "Sold"
 *         city:
 *           type: string
 *           description: City where the car is located.
 *           example: "San Francisco"
 *         state:
 *           type: string
 *           description: State where the car is located.
 *           example: "California"
 *         zip_code:
 *           type: string
 *           description: ZIP code of the car's location.
 *           example: "94105"
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *           example: "USA"
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *           example: 2019
 *         price:
 *           type: number
 *           description: Price of the car.
 *           example: 22000
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *           example: "Toyota"
 *         model:
 *           type: string
 *           description: Model of the car.
 *           example: "Camry"
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *           example: 14000
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
 *           example: "Red"
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *           example: "Black"
 *         body:
 *           type: string
 *           description: Body type of the car.
 *           example: "Sedan"
 *         number_of_doors:
 *           type: integer
 *           description: Number of doors the car has.
 *           example: 4
 *         number_of_seats:
 *           type: integer
 *           description: Number of seats in the car.
 *           example: 5
 *         notes:
 *           type: string
 *           description: Additional notes or description.
 *           example: "Updated notes for the car."
 *     CarDetails:
 *       type: object
 *       properties:
 *         car_id:
 *           type: integer
 *           description: Unique identifier for the car.
 *         brand:
 *           type: string
 *           description: Brand of the car.
 *         model:
 *           type: string
 *           description: Model of the car.
 *         year:
 *           type: integer
 *           description: Manufacturing year of the car.
 *         price:
 *           type: number
 *           description: Price of the car.
 *         mileage:
 *           type: integer
 *           description: Mileage of the car.
 *         fuel:
 *           type: string
 *           description: Fuel type of the car.
 *         traction:
 *           type: string
 *           description: Traction type of the car.
 *         engine_size:
 *           type: number
 *           description: Engine size in liters.
 *         engine_power:
 *           type: number
 *           description: Engine power in HP.
 *         transmission:
 *           type: string
 *           description: Transmission type.
 *         color:
 *           type: string
 *           description: Exterior color of the car.
 *         interior_color:
 *           type: string
 *           description: Interior color of the car.
 *         body:
 *           type: string
 *           description: Body type of the car.
 *         country:
 *           type: string
 *           description: Country where the car is located.
 *         state:
 *           type: string
 *           description: State where the car is located.
 *         location_id:
 *           type: integer
 *           description: Unique identifier for the location.
 *         address:
 *           type: string
 *           description: Address of the location.
 *         city:
 *           type: string
 *           description: City of the location.
 *         location_state:
 *           type: string
 *           description: State of the location.
 *         location_country:
 *           type: string
 *           description: Country of the location.
 *         posts:
 *           type: object
 *           properties:
 *             post_id:
 *               type: integer
 *               description: Unique identifier for the post.
 *             user_id:
 *               type: integer
 *               description: Unique identifier for the user who created the post.
 *             car_id:
 *               type: integer
 *               description: Unique identifier for the car associated with the post.
 *             title:
 *               type: string
 *               description: Title of the post.
 *             status:
 *               type: string
 *               description: Status of the car (e.g., Available, Sold).
 *             content:
 *               type: string
 *               description: Content or description of the post.
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the post was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the post was last updated.
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
carsRouter.put('/:id', isAuthenticated, updatePostValidation, async(req, res) => {
    const client = await pool.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await client.query('BEGIN');
        
        const id = req.params.id;
        
        const carCheck = await client.query(
            'SELECT location_id FROM cars WHERE car_id = $1',
            [id]
        );

        if (carCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const location_id = carCheck.rows[0].location_id;

        const {
            status, city, state, title, zip_code, country, year, price, brand, mileage,
            fuel, traction, engine_size, engine_power, transmission, color, interior_color,
            body, number_of_doors, number_of_seats, notes
        } = req.body;

        if (city || state || zip_code || country) {
            const locationFields = [];
            const locationValues = [];
            let valueCount = 1;

            if (city) {
                locationFields.push(`city = $${valueCount}`);
                locationValues.push(city);
                valueCount++;
            }
            if (state) {
                locationFields.push(`state = $${valueCount}`);
                locationValues.push(state);
                valueCount++;
            }
            if (zip_code) {
                locationFields.push(`zip_code = $${valueCount}`);
                locationValues.push(zip_code);
                valueCount++;
            }
            if (country) {
                locationFields.push(`country = $${valueCount}`);
                locationValues.push(country);
                valueCount++;
            }

            locationValues.push(location_id);
            await client.query(
                `UPDATE locations SET ${locationFields.join(', ')} WHERE location_id = $${valueCount}`,
                locationValues
            );
        }

        if (year || price || brand || mileage || fuel || traction || engine_size || 
            engine_power || transmission || color || interior_color || body || 
            number_of_doors || number_of_seats || notes) {
            
            const carFields = [];
            const carValues = [];
            let valueCount = 1;

            if (year) {
                carFields.push(`year = $${valueCount}`);
                carValues.push(year);
                valueCount++;
            }
            if (price) {
                carFields.push(`price = $${valueCount}`);
                carValues.push(price);
                valueCount++;
            }
            if (brand) {
                carFields.push(`brand = $${valueCount}`);
                carValues.push(brand);
                valueCount++;
            }
            if (mileage) {
                carFields.push(`mileage = $${valueCount}`);
                carValues.push(mileage);
                valueCount++;
            }
            if (fuel) {
                carFields.push(`fuel = $${valueCount}`);
                carValues.push(fuel);
                valueCount++;
            }
            if (traction) {
                carFields.push(`traction = $${valueCount}`);
                carValues.push(traction);
                valueCount++;
            }
            if (engine_size) {
                carFields.push(`engine_size = $${valueCount}`);
                carValues.push(engine_size);
                valueCount++;
            }
            if (engine_power) {
                carFields.push(`engine_power = $${valueCount}`);
                carValues.push(engine_power);
                valueCount++;
            }
            if (transmission) {
                carFields.push(`transmission = $${valueCount}`);
                carValues.push(transmission);
                valueCount++;
            }
            if (color) {
                carFields.push(`color = $${valueCount}`);
                carValues.push(color);
                valueCount++;
            }
            if (interior_color) {
                carFields.push(`interior_color = $${valueCount}`);
                carValues.push(interior_color);
                valueCount++;
            }
            if (body) {
                carFields.push(`body = $${valueCount}`);
                carValues.push(body);
                valueCount++;
            }
            if (number_of_doors) {
                carFields.push(`number_of_doors = $${valueCount}`);
                carValues.push(number_of_doors);
                valueCount++;
            }
            if (number_of_seats) {
                carFields.push(`number_of_seats = $${valueCount}`);
                carValues.push(number_of_seats);
                valueCount++;
            }
            if (notes) {
                carFields.push(`notes = $${valueCount}`);
                carValues.push(notes);
                valueCount++;
            }

            carValues.push(id);
            await client.query(
                `UPDATE cars SET ${carFields.join(', ')} WHERE car_id = $${valueCount}`,
                carValues
            );
        }

        if (status || title) {
            const postFields = [];
            const postValues = [];
            let valueCount = 1;

            if (status) {
                postFields.push(`status = $${valueCount}`);
                postValues.push(status);
                valueCount++;
            }
            if (title) {
                postFields.push(`title = $${valueCount}`);
                postValues.push(title);
                valueCount++;
            }

            postValues.push(id);
            await client.query(
                `UPDATE posts SET ${postFields.join(', ')} WHERE car_id = $${valueCount}`,
                postValues
            );
        }

        const query = await client.query(`
            SELECT 
                cars.*, 
                locations.*, 
                posts.*,
                array_agg(DISTINCT images.image_url) AS image_urls
            FROM cars
            LEFT JOIN locations ON locations.location_id = cars.location_id
            LEFT JOIN posts ON posts.car_id = cars.car_id
            LEFT JOIN images ON images.car_id = cars.car_id
            WHERE cars.car_id = $1
            GROUP BY cars.car_id, locations.location_id, posts.post_id;
        `, [id]);

        await client.query('COMMIT');

        if (query.rows.length === 0) {
            return res.status(404).json({ error: 'Updated car not found' });
        }

        return res.json(query.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('PUT Error:', err);
        return res.status(500).json({error: 'Server error', details: err.message});
    } finally {
        client.release();
    }
});

/**
 * @swagger
 * /cars/migrate-images/{oldPostId}/{newPostId}:
 *   post:
 *     summary: Migrate images from an old post to a new post
 *     description: Transfer images associated with an old post to a new post for the authenticated user.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oldPostId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the old post from which to migrate images.
 *       - in: path
 *         name: newPostId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 456
 *         description: The unique identifier of the new post to which images will be migrated.
 *     responses:
 *       200:
 *         description: Successfully migrated images to the new post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the migration was successful.
 *                   example: true
 *       400:
 *         description: Bad request due to invalid post IDs.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Image migration failed: Invalid post IDs"
 *       401:
 *         description: Unauthorized access. Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized access. Please provide a valid token."
 *       404:
 *         description: New post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Image migration failed: New post not found"
 *       500:
 *         description: Internal server error during image migration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Image migration failed: Detailed error message explaining what went wrong."
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong.
 *           example: "Image migration failed: Invalid post IDs"
 *         details:
 *           type: string
 *           description: Additional details about the error (optional).
 *           example: "Detailed error message explaining what went wrong."
 */
carsRouter.post('/migrate-images/:oldPostId/:newPostId', isAuthenticated, async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      const oldPostId = parseInt(req.params.oldPostId);
      const newPostId = parseInt(req.params.newPostId);
  
      if (isNaN(oldPostId) || isNaN(newPostId)) {
        throw new Error('Invalid post IDs');
      }
  
      const newPost = await client.query(
        `SELECT car_id FROM posts WHERE post_id = $1`,
        [newPostId]
      );
  
      if (newPost.rows.length === 0) {
        throw new Error('New post not found');
      }
  
      await client.query(`
        INSERT INTO images (car_id, image_url, original_post_id)
        SELECT $1, image_url, $2
        FROM images
        WHERE original_post_id = $3
      `, [
        newPost.rows[0].car_id,
        newPostId,
        oldPostId
      ]);
  
      await client.query('COMMIT');
      res.json({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Image migration failed: ' + err.message });
    } finally {
      client.release();
    }
  });

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a specific car post by ID
 *     description: Delete a specific car post and all related data, including images, if authorized.
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The unique identifier of the car post to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the car post and related data.
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
 *         description: Forbidden. You can only delete your own posts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Unauthorized"
 *               message: "You can only delete your own posts"
 *       404:
 *         description: Car or post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: "Car not found!"
 *       500:
 *         description: Internal server error during deletion.
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
carsRouter.delete('/:id', isAuthenticated, deletePostValidaton, async (req, res) => {
  const client = await pool.connect();
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      await client.query('BEGIN');
      const id = req.params.id;

      const car = await client.query(
          `SELECT * FROM cars WHERE car_id = $1;`,
          [id]
      );
      const post = await client.query(
          `SELECT * FROM posts WHERE car_id = $1`,
          [id]
      );
      const images = await client.query(
          `SELECT image_url FROM images WHERE car_id = $1`,
          [id]
      );

      if (car.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: `Car not found!` });
      }

      if (post.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: `Post not found!` });
      }

      if (post.rows[0].user_id === req.user.id) {
        const imageUsageChecks = await Promise.all(
          images.rows.map(async (img) => {
            const res = await client.query(
              `SELECT COUNT(*) FROM images WHERE image_url = $1`,
              [img.image_url]
            );
            return res.rows[0].count > 1;
          })
        );
    
        images.rows.forEach((img, index) => {
          if (!imageUsageChecks[index]) {
            const imagePath = path.join(__dirname, '..', img.image_url);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
        });

          await client.query(`DELETE FROM saved WHERE post_id = $1;`, [post.rows[0].post_id]);

          await client.query(`DELETE FROM posts WHERE car_id = $1;`, [id]);

          await client.query(`DELETE FROM images WHERE car_id = $1;`, [id]);
          await client.query(`DELETE FROM cars WHERE car_id = $1;`, [id]);
          await client.query(`DELETE FROM locations WHERE location_id = $1;`, [car.rows[0].location_id]);

          await client.query('COMMIT');

          return res.json({
              message: 'Successfully deleted car and all related data',
              deletedCar: car.rows[0]
          });
      } else {
          await client.query('ROLLBACK');
          return res.status(403).json({
              error: 'Unauthorized',
              message: 'You can only delete your own posts'
          });
      }
  } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
      client.release();
  }
});
  



module.exports = carsRouter;