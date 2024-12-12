const express = require('express');
const carsRouter = express.Router();
const pool = require('../db');

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
             LEFT JOIN images ON images.car_id = cars.id
             LEFT JOIN locations ON cars.location_id = locations.id
             LEFT JOIN posts ON posts.car_id = cars.id
             GROUP BY cars.id, locations.id, posts.id;`)
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
                LEFT JOIN locations ON cars.location_id = locations.id
                LEFT JOIN posts ON posts.car_id = cars.id
                LEFT JOIN images ON images.car_id = cars.id
                WHERE ` + filters.join(' AND ') + ` GROUP BY cars.id, locations.id, posts.id;`);
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
             LEFT JOIN images ON images.car_id = cars.id
             LEFT JOIN locations ON cars.location_id = locations.id
             LEFT JOIN posts ON posts.car_id = cars.id
             WHERE cars.id = ${id}
             GROUP BY cars.id, locations.id, posts.id;`
        );
        if(car.length === 0){
            return res.status(404).json({error: `We couldn\'t fint the car with the id number: ${id}`})
        };

        res.send(car.rows);
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});

carsRouter.post('/', async(req, res)=>{
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
               image_urls,
               user_id} = req.body;

               if(!Array.isArray(image_urls)){
                res.status(400).json({error: 'image_urls must be an array'});
               };

               await client.query('BEGIN');

               function take_number(name){
                const array =[];
                name.rows.forEach(element=> array.push(element.max));
                return name = array.join();
               };

               const last_car = await client.query(`SELECT MAX(id) FROM cars;`);
               const last_car_id = last_car? take_number(last_car) : 0;
               const last_location = await client.query(`SELECT MAX(id) FROM locations;`);
               const last_location_id = last_location ? take_number(last_location) : 0;
               const last_post = await client.query(`SELECT MAX(id) FROM posts;`);
               const last_post_id = last_post ? take_number(last_post) : 0;

               const location_id = Number(last_location_id) + 1;
               const car_id = Number(last_car_id) + 1;
               const post_id = Number(last_post_id) + 1;
               const created_at = Date.now();
            
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
                
                for (let image_url of image_urls){
                    const last_image = await client.query(`SELECT max(id) FROM images;`);
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
                     LEFT JOIN cars ON posts.car_id = cars.id
                     LEFT JOIN locations ON cars.location_id = locations.id
                     LEFT JOIN images ON images.car_id = cars.id
                     WHERE posts.id = $1;`, [post_id]
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

/*carsRouter.put('/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const car = await pool.query(
            `SELECT * FROM cars WHERE id = ${id};`
        );

        if(car.length === 0){
            res.send(404).json({error: `We couldn\'t fint the car with the id number: ${id}`});
        };

        const remove = await pool.query(
            `DELETE FROM cars WHERE id = ${id};`
        );

        res.send(car.rows);
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});
*/

carsRouter.delete('/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const car = await pool.query(
            `SELECT * FROM cars WHERE id = ${id};`
        );

        if(car.length === 0){
            res.send(404).json({error: `We couldn\'t fint the car with the id number: ${id}`});
        };

        const remove = await pool.query(
            `DELETE FROM cars WHERE id = ${id};`
        );

        res.send(car.rows);
    }catch(err){
        res.status(500).json({error: 'Server error', details: err.message});
    }
});


module.exports = carsRouter;