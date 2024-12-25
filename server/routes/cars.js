const express = require('express');
const carsRouter = express.Router();
const pool = require('../db');
const {body, param} = require('express-validator');

const validate = validations =>{
    return async(req,res,next)=>{
        for(const validation of validations){
            const result = await validation.run(req);
            if(!result.isEmpty()){
                return res.status(400).json({errors: result.array()});
            }
        }

        next();
    }
};

const createPostValidation = [
        body('status').isString.notEmpty().withMessage('Status must not be Empty'),

        body('city').isString().notEmpty().withMessage('City must not be Empty'),

        body('state').isString().notEmpty().withMessage('State must not be empty'),

        body('title').isString().isLength({min: 10}).withMessage('Title must be at least 10 characters long'),

        body('zip_code').isPostalCode().withMessage('Invalid postal code')
        .notEmpty().withMessage('Postal code must not be empty'),

        body('country').isString().notEmpty().withMessage('Country must not be empty'),

        body('year').isInt({min: 1800, max: 2025}).withMessage('Year must be between 1800 and 2025')
        .notEmpty().withMessage('Year must not be empty'),

        body('price').isFloat({min: 0}).withMessage('Price must be a positive number')
        .notEmpty().withMessage('Price must not be empty'),

        body('brand').isString().notEmpty().withMessage('Brand must not be empty'),

        body('mileage').optional().isFloat({min: 0}).withMessage('Mileage must be a positive number'),

        body('fuel').isString().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Invalid fuel type'),

        body('traction').optional().isString().isIn(['2WD', 'AWD', '4WD']).withMessage('Invalid traction type'),

        body('engine_size').optional().isFloat({ min: 0 }).withMessage('Engine size must be a positive number'),

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

        body('zip_code').optional().isPostalCode().withMessage('Invalid postal code'),

        body('country').optional().isString().withMessage('Invalid country'),

        body('year').optional().isInt({min: 1800, max: 2025}).withMessage('Year must be between 1800 and 2025'),

        body('price').optional().isFloat({min: 0}).withMessage('Price must be a positive number'),

        body('brand').optional().isString().withMessage('Invalid brand'),

        body('mileage').optional().isFloat({min: 0}).withMessage('Mileage must be a positive number'),

        body('fuel').optional().isString().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Invalid fuel type'),

        body('traction').optional().isString().isIn(['2WD', 'AWD', '4WD']).withMessage('Invalid traction type'),

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
        let query = '';

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
            const { price_from, 
                price_to, 
                year_from, 
                year_to, 
                brand, 
                mileage_from, 
                mileage_to, 
                fuel, 
                traction, 
                engine_size_from, 
                engine_size_to, 
                engine_power_from, 
                engine_power_to, 
                transmission,
                color,
                interior_color,
                body
                } = req.query;

            function checkArray (columnName,typ){
                if(Array.isArray(typ)){
                    let narray = typ.map(x=>`cars.${columnName} = '${x}'`);
                    const newa = narray.join(' OR ');
                    filters.push(`(${newa})`);
                }else{
                    filters.push(`cars.${columnName} = '${typ}'`);
                };
            };

            if(price_from){
                filters.push(`cars.price >= money(${price_from})`);
            };
            if(price_to){
                filters.push(`cars.price <= money(${price_to})`);
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

carsRouter.post('/',validate(createPostValidation), async(req, res)=>{
    const client = await pool.connect();
    try{
        const {title,
               status,
               city,
               state,
               zip_code,
               country,
               year,
               price,
               brand,
               mileage,
               fuel,
               traction,
               engine_size,
               engine_power,
               transmission,
               color,
               interior_color,
               body,
               number_of_doors,
               number_of_seats,
               notes,
               image_urls} = req.body;
               
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
                VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                    );
                `, [location_id, city, state, zip_code, country]);

             await client.query(`
                INSERT INTO cars
                VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12,
                    $13,
                    $14,
                    $15,
                    $16,
                    $17
                    );`, [car_id, location_id, year, price, brand, mileage, fuel, traction,
                        engine_size, engine_power, transmission, color,  interior_color, body,
                        number_of_doors, number_of_seats, notes]
                );

                await client.query(`
                INSERT INTO  posts
                VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    NOW()
                    );
                `, [post_id, title, user_id, car_id, status]);
                

                //Loop to insert multiple pictures of the same car in the database
                for (let image_url of image_urls){
                    const last_image = await client.query(`SELECT max(image_id) FROM images;`);
                    const last_image_id = take_number(last_image);
                    const image_id = Number(last_image_id) + 1;
    
                    await client.query(`
                        INSERT INTO  images
                        VALUES(
                        $1,
                        $2,
                        $3                
                        );`, [image_id, car_id, image_url]);
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

carsRouter.put('/:id',validate(updatePostValidation), async(req, res)=>{
    const client = await pool.connect();
    try{

        const id = req.params.id;
        const {
            status,city,state,title,zip_code,country,year,price,brand,mileage,
            fuel,traction,engine_size,engine_power,transmission,color,interior_color,
            body,number_of_doors,number_of_seats,notes} = req.body;

        const location_details = [];
        const car_details = [];
        const post_details = [];

        function take_number(data){
         return data.rows.map(element => element.location_id).join(',');
        };

        if(city) location_details.push(`city = '${city}'`);
        if(state) location_details.push(`state = '${state}'`);
        if(zip_code) location_details.push(`zip_code = '${zip_code}'`);
        if(country) location_details.push(`country = '${country}'`)  
        if(year) car_details.push(`year = '${year}'`);
        if(price) car_details.push(`price = '${price}'`);
        if(brand) car_details.push(`brand = '${brand}'`);
        if(mileage) car_details.push(`mileage = '${mileage}'`);
        if(fuel) car_details.push(`fuel = '${fuel}'`);
        if(traction) car_details.push(`traction = '${traction}'`);
        if(engine_size) car_details.push(`engine_size = '${engine_size}'`);
        if(engine_power) car_details.push(`engine_power = '${engine_power}'`);
        if(transmission) car_details.push(`transmission = '${transmission}'`);
        if(color) car_details.push(`color = '${color}'`);
        if(interior_color) car_details.push(`interior_color = '${interior_color}'`)
        if(body) car_details.push(`body = '${body}'`);
        if(number_of_doors) car_details.push(`number_of_doors = '${number_of_doors}'`);
        if(number_of_seats) car_details.push(`number_of_seats = '${number_of_seats}'`);
        if(notes) car_details.push(`notes = '${notes}'`)
        if(status) post_details.push(`status = '${status}'`);
        if(title) post_details.push(`title = '${title}'`);

        const cars_location_id = await client.query(`
            SELECT location_id FROM cars WHERE car_id = $1;`, [id]);

           const newArr = take_number(cars_location_id);

        if(location_details.length > 0){    
        await client.query(`
            UPDATE locations
            SET ` + location_details.join(' , ')+ ` WHERE locations.location_id = $1;`, [newArr]);
        };
        if(car_details.length > 0){
        await client.query(`
            UPDATE cars
            SET ` + car_details.join(' , ')+ ` WHERE cars.car_id = $1;`,[id]);
        };
        if(post_details.length >0){
        await client.query(`
            UPDATE posts
            SET ` + post_details.join(' , ') + ` WHERE posts.car_id = $1;`, [id]);
        };

        const query = await client.query(`
            SELECT cars.*, locations.*, posts.*,array_agg(images.image_url) AS image_urls
            FROM cars
            LEFT JOIN locations
            ON locations.location_id = cars.location_id
            LEFT JOIN posts
            ON posts.car_id = cars.car_id
            LEFT JOIN images
            ON  images.car_id = cars.car_id
            WHERE cars.car_id = $1
            GROUP BY cars.car_id,locations.location_id, posts.post_id ;`,[id]);

         await client.query('COMMIT');

         res.send(query.rows);

    }catch(err){
        await client.query('ROLLBACK');
        res.status(500).json({error: 'Server error', details: err.message});
    }finally{
        client.release();
    }
});

carsRouter.delete('/:id', validate(deletePostValidaton), async(req, res)=>{
    try{
        const id = req.params.id;
        const car = await pool.query(
            `SELECT * FROM cars WHERE car_id = $1;`,[id]
        );

        if(car.length === 0){
            res.send(404).json({error: `We couldn\'t fint the car with the id number: ${id}`});
        };

        const remove = await pool.query(
            `DELETE FROM cars WHERE car_id = $1;`,[id]
        );

    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});



module.exports = carsRouter;