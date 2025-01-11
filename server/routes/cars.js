const express = require('express');
const carsRouter = express.Router();
const pool = require('../db');
const {body, param, validationResult} = require('express-validator');
const isAuthenticated = require('../auth');

const createPostValidation = [
        body('status').isString().notEmpty().withMessage('Status must not be Empty'),

        body('city').isString().notEmpty().withMessage('City must not be Empty'),

        body('state').isString().notEmpty().withMessage('State must not be empty'),

        body('title').isString().isLength({min: 10}).withMessage('Title must be at least 10 characters long'),

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

        body('engine_size').optional().isFloat({ min: 100 }).withMessage('Engine size must be a positive number'),

        body('engine_power').optional().isInt({ min: 0 }).withMessage('Engine power must be a positive integer'),

        body('transmission').optional().isString().isIn(['Automatic', 'Manual']).withMessage('Invalid transmission'),

        body('color').optional().isString().withMessage('Invalid color'),

        body('interior_color').optional().isString().withMessage('Invalid interior color'),

        body('body').optional().isString().withMessage('Invalid body'),

        body('number_of_doors').optional().isInt({min: 1, max: 10}).withMessage('Invalid number of doors'),

        body('number_id_seats').optional().isInt({min: 1, max: 60}).withMessage('Invalid number of seats'),

        body('notes').optional().isString().isLength({min: 10, max: 1000}).withMessage('notes length must be between 10 and 1000')
    ];

const updatePostValidation = [
    param('id').optional().isInt().withMessage('Invalid Car Id'),

    body('status').optional().isString().withMessage('Invalid Status'),

        body('city').optional().isString().withMessage('Invalid city'),

        body('state').optional().isString().withMessage('Invalid state'),

        body('title').optional().isString().isLength({min: 10}).withMessage('Title must be at least 10 characters long'),

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

        body('number_id_seats').optional().isInt({min: 1, max: 60}).withMessage('Invalid number of seats'),

        body('notes').optional().isString().isLength({min: 10, max: 1000}).withMessage('notes length must be between 10 and 1000'),
];

const deletePostValidaton =[
    param('id').isInt().withMessage('Invalid Car Id')
];


carsRouter.get('/',async (req,res)=>{
    try{
            
        const filters = [];
        let query ;

        if(!Object.keys(req.query).length){
            query = await pool.query(`
             SELECT 
             cars.*, 
             locations.*, 
             posts.*, 
             array_agg(images.image_url) AS image_urls
             FROM cars 
             LEFT JOIN images ON images.car_id = cars.car_id
             LEFT JOIN locations ON cars.location_id = locations.location_id
             LEFT JOIN posts ON posts.car_id = cars.car_id
             GROUP BY cars.car_id, locations.location_id, posts.post_id;`)
        }  else{
            const { price_from, price_to, year_from, year_to, brand, model, mileage_from, mileage_to, 
                fuel, traction, engine_size_from, engine_size_to, engine_power_from, engine_power_to, 
                transmission,color,interior_color,body,country,state} = req.query;

            function checkArray (columnName,typ){
                if(Array.isArray(typ)){
                    let narray = typ.map(x=>`cars.${columnName} = '${x}'`);
                    const newa = narray.join(' OR ');
                    filters.push(`(${newa})`);
                }else{
                    filters.push(`cars.${columnName} = '${typ}'`);
                };
            };

            if (country) {
                filters.push(`locations.country = '${country}'`);
            };
            if (state) {
                filters.push(`locations.state = '${state}'`);
            };


            if(price_from){
                filters.push(`CAST(cars.price AS DECIMAL) >= ${price_from}`);
            };
            if(price_to){
                filters.push(`CAST(cars.price AS DECIMAL) <= ${price_to}`);
            };
            if(year_from){
                filters.push(`cars.year >= ${year_from}`);
            };
            if(year_to){
                filters.push(`cars.year <= ${year_to}`);
            };
            if(brand){
                checkArray('brand',brand);
            };
            if(model){
                checkArray('model', model);
            };
            if(mileage_from){
                filters.push(`cars.mileage >= ${mileage_from}`);
            };
            if(mileage_to){
                filters.push(`cars.mileage <= ${mileage_to}`);
            };
            if(fuel){
                checkArray('fuel',fuel);
            };
            if(traction){
                checkArray('traction',traction);
            };
            if(engine_size_from){
                filters.push(`cars.engine_size >= ${engine_size_from}`);
            };
            if(engine_size_to){
                filters.push(`cars.engine_size <= ${engine_size_to}`);
            };
            if(engine_power_from){
                filters.push(`cars.engine_power >= ${engine_power_from}`);
            };
            if(engine_power_to){
                filters.push(`cars.engine_power <= ${engine_power_to}`);
            };
            if(transmission){
                filters.push(`cars.transmission = '${transmission}'`);
            };
            if(color){
                checkArray('color',color);
            };
            if(interior_color){
                filters.push(`cars.interior_color = '${interior_color}'`);
            };
            if(body){
                checkArray('body',body);
            };

            query = await pool.query(`
                SELECT 
                cars.*,
                locations.*,
                posts.*,
                array_agg(images.image_url) AS image_urls 
                FROM cars 
                LEFT JOIN locations ON cars.location_id = locations.location_id
                LEFT JOIN posts ON posts.car_id = cars.car_id
                LEFT JOIN images ON images.car_id = cars.car_id
                WHERE ` + filters.join(' AND ') + ` GROUP BY cars.car_id, locations.location_id, posts.post_id;`);
        }; 

        if(query.rows.length === 0){
            return res.status(404).json({error: 'We could\'t find any cars'})
        }
        res.send(query.rows);
    }
    catch(err){
        console.error(err.message);
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
             WHERE cars.car_id = ${id}
             GROUP BY cars.car_id, locations.location_id, posts.post_id;`
        );
        if(car.length === 0){
            return res.status(404).json({error: `We couldn\'t fint the car with the id number: ${id}`})
        };

        res.send(car.rows);
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

carsRouter.post('/',isAuthenticated, createPostValidation,async(req, res)=>{
    const client = await pool.connect();
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        const {title,status,city,state,zip_code,country,year,price,brand,model,mileage,
               fuel,traction,engine_size,engine_power,transmission,color,interior_color,
               body,number_of_doors,number_of_seats,notes,street_address, image_urls} = req.body;
               
        const user_id = req.user.id;

               await client.query('BEGIN');

               //Function to take out max(id) from the object and array that is wrapped in 
               function take_number(data){
                return data.rows.map(element => element.max).join(',');
               };

               const last_car = await client.query(`SELECT MAX(car_id) FROM cars;`);
               const last_location = await client.query(`SELECT MAX(location_id) FROM locations;`);
               const last_post = await client.query(`SELECT MAX(post_id) FROM posts;`);

               const last_car_id = last_car? take_number(last_car) : 0;
               const last_location_id = last_location ? take_number(last_location) : 0;
               const last_post_id = last_post ? take_number(last_post) : 0;

               const location_id = Number(last_location_id) + 1;
               const car_id = Number(last_car_id) + 1;
               const post_id = Number(last_post_id) + 1;
            
             await client.query(`
                INSERT INTO  locations
                VALUES($1,$2,$3,$4,$5, $6);`, 
                [location_id, city, state, zip_code, country, street_address]);

             await client.query(`
                INSERT INTO cars
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18);`, 
                [car_id, location_id, year, price, brand, mileage, fuel, traction,
                engine_size, engine_power, transmission, color,  interior_color, body,
                number_of_doors, number_of_seats, notes, model]
                );

                await client.query(`
                INSERT INTO  posts
                VALUES($1,$2,$3,$4,$5,NOW());`, 
                [post_id, title, user_id, car_id, status]);
                

                //Loop to insert multiple pictures of the same car in the database
                if(image_urls?.length > 0){
                if(!Array.isArray(image_urls)){
                    res.status(400).json({error: 'image_urls must be an array'});
                   };
                for (let image_url of image_urls){
                    const last_image = await client.query(`SELECT max(image_id) FROM images;`);
                    const last_image_id = take_number(last_image);
                    const image_id = Number(last_image_id) + 1;
    
                    await client.query(`
                        INSERT INTO  images
                        VALUES($1,$2,$3);`, 
                        [image_id, car_id, image_url]);
                    };
                };

                const createdPost = await client.query(
                    `SELECT * FROM posts 
                     LEFT JOIN cars ON posts.car_id = cars.car_id
                     LEFT JOIN locations ON cars.location_id = locations.location_id
                     LEFT JOIN images ON images.car_id = cars.car_id
                     WHERE posts.post_id = $1;`, [post_id]
                );

                await client.query('COMMIT');

                res.send(createdPost.rows);
                
    }catch(err){
        await client.query('ROLLBACK');
        res.status(500).json({error: 'Server error', details: err.message});
    }finally{
        client.release();
    }
});

carsRouter.put('/:id', isAuthenticated, updatePostValidation, async(req, res) => {
    const client = await pool.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await client.query('BEGIN');
        
        const id = req.params.id;
        
        // First check if the car exists and get its location_id
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

        // Update locations if any location fields are present
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

        // Update car if any car fields are present
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

        // Update post if any post fields are present
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

        // Get updated data
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

carsRouter.delete('/:id',isAuthenticated, deletePostValidaton, async(req, res)=>{
    const client = await pool.connect();
    try{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        };
        await client.query('BEGIN');
        const id = req.params.id;
        const car = await client.query(
            `SELECT * FROM cars WHERE car_id = $1;`,[id]
        );
        const post = await client.query(
            `SELECT * FROM posts WHERE car_id = $1`,
            [id]
        );

        if(car.rows.length === 0){
            return res.send(404).json({error: `Car not found!`});
        };

        if(post.rows[0].user_id === req.user.id){

        await client.query(`DELETE FROM cars WHERE car_id = $1;`,[id]);
        await client.query(`DELETE FROM images WHERE car_id = $1;`,[id]);
        await client.query(`DELETE FROM posts WHERE car_id = $1;`,[id]);
        await client.query(`DELETE FROM locations WHERE location_id = $1;`,[car.rows[0].location_id]);
        await client.query(`DELETE FROM saved WHERE post_id = $1`, [post.rows[0].post_id])

        await client.query('COMMIT');

        return res.json({
            message: 'Successfully deleted car and all related data',
            deletedCar: car.rows[0]
        });}
        else{
            return res.status(403).json({
                error: 'Unauthorized',
                message: 'You can only delete your own posts' });
        };

    }catch(err){
        await client.query('ROLLBACK')
        res.status(500).json({error: 'Server error', details: err.message});
    }finally{
        client.release();
    }
});



module.exports = carsRouter;