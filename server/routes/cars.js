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