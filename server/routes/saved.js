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