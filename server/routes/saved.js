const express = require('express');
const savedRouter = express.Router();
const pool = require('../db');
const {body,param} = require('express-validator');
const isAuthenticated = require('../auth');

const createSavedPostValidation = [
body('post_id')
.isInt().withMessage('Invalid Post Id')
];

const deleteSavedPostValidation = [
param('id')
.isInt().withMessage('Invalid Saved Post Id')
];

savedRouter.get('/', isAuthenticated,async (req,res)=>{
    try{
        const userId = req.user.id;

        const results = await pool.query(`
            SELECT * FROM saved WHERE user_id = $1;
            `, [userId]);

        if(results.rows.length < 1){
            return res.sendStatus(404);
        };

        res.send(results.rows);

    }catch(err){
        res.status(500).json({error: 'server error', details: err.message});
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
            if (post.rows.length < 1){
                return res.status(404).send("We could't find the selected post");
            };

            function take_number(data){
                return data.rows.map(element => element.max).join(',');
               };

            const last_saved = await client.query(`
                SELECT max(id) FROM saved;`);
            const last_saved_id = last_saved ? take_number(last_saved) : 0 ;
            const saved_id = last_saved_id + 1; 

            await client.query(`
                INSERT INTO saved
                VALUES (
                $1, $2, $3, NOW())`,[saved_id, post_id, userId]);

            const result = await client.query(`
                SELECT * FROM saved WHERE id = $1`, [saved_id]);

            

            await client.query('COMMIT');

            res.send(result.rows);
            
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