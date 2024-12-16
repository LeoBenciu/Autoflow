const express = require('express');
const conversationsRouter = express.Router();
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

const createConversationValidation = [
    body('buyer_id')
    .isInt().withMessage('Invalid Buyer Id'),

    body('seller_id')
    .isInt().withMessage('Invalid Seller Id'),

    body('post_id')
    .isInt().withMessage('Invalid Post Id')
];

const createMessageValidation = [
    param('id')
    .isInt().withMessage('Invalid Conversation Id'),

    body('sender_id')
    .isInt().withMessage('Invalid Sender Id'),

    body('message')
    .trim()
    .notEmpty().withMessage("Message can't be empty")
];

const deleteConversationValidation =[
    body('conversationId').isInt().withMessage('Invalid Conversation Id')
];

const deleteMessageValidation = [
    param('id').isInt().withMessage('Invalid Conversation Id'),
    body('messageId').isInt().withMessage('Invalid Message Id')
];


//CONVERSATIONS
conversationsRouter.get('/conversations/buy', async(req,res)=>{
    try {
        const userId = req.user.id;

        const results = await pool.query(`
            SELECT * FROM conversations WHERE buyer_id = $1`, [userId]);

        res.send(results.rows);

    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

conversationsRouter.get('/conversations/sell', async(req,res)=>{
    try {
        const userId = req.user.id;

        const results = await pool.query(`
            SELECT * FROM conversations WHERE seller_id = $1`, [userId]);
        
        res.send(results.rows);

    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

conversationsRouter.post('/conversations', validate(createConversationValidation), async(req,res)=>{
    const client = await pool.connect();
    try {
            await client.query(`BEGIN`);
            const {buyer_id, seller_id, post_id} = req.body;
            
            function take_number(data){
                return data.rows.map(element => element.max).join(',');
               };

            const last_conversation = await client.query(`SELECT max(id) from conversations;`);
            const last_conversation_id = last_conversation? take_number(last_conversation) : 0;
            const conversation_id = last_conversation_id + 1;

            await client.query(`INSERT INTO conversations 
                VALUES($1,$2,$3,$4,NOW())`,[conversation_id, buyer_id, seller_id, post_id]);

            const created_conversation = await client.query(`SELECT * FROM conversations WHERE id = $1`,[conversation_id]);

            await client.query(`COMMIT`);

            res.send(created_conversation.rows);

    } catch (err) {
        await client.query(`ROLLBACK`);
        res.status(500).json({error: 'server error', details: err.message});
    }finally{
        client.release();
    }
    
});

conversationsRouter.delete('/conversations',validate(deleteConversationValidation), async(req,res)=>{
    try {
        const {conversationId} = req.body;

        const conversation_deleted = await pool.query(`
            SELECT * FROM conversations WHERE id = $1`, [conversationId]);

        await pool.query(`DELETE FROM conversations WHERE id = $1`, [conversationId]);

        res.send(conversation_deleted.rows);

    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});


//Messages
conversationsRouter.get('/conversations/:id', async(req,res)=>{
    try {
        const conversationId = req.params.id;

        const messages = await pool.query(`
            SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at`, [conversationId]);

        res.send(messages.rows);
        
    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

conversationsRouter.post('/conversations/:id',validate(createMessageValidation), async(req,res)=>{
    const client = await pool.connect();
    try {  
            await client.query(`BEGIN`);
            const {sender_id, message} = req.body;
            const conversation_id = req.params.id;

            function take_number(data){
                return data.rows.map(element => element.max).join(',');
               };

            const last_message = await client.query(`SELECT max(id) from messages;`);
            const last_message_id = last_message? take_number(last_message) : 0;
            const message_id = last_message_id + 1;

            await client.query(`INSERT INTO messages 
                VALUES($1,$2,$3,false,$4,NOW());`,[message_id, conversation_id,sender_id, message]);

            const created_message = await client.query(`SELECT * FROM messages WHERE id = $1`, [message_id]);

            await client.query(`COMMIT`);

            res.send(created_message.rows);
        
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({error: 'server error', details: err.message});
    }finally{
        client.release();
    }
});

conversationsRouter.delete('/conversations/:id', validate(deleteMessageValidation), async(req,res)=>{
    try {
            const conversationId = req.params.id;
            const {messageId} = req.body;

            const message_deleted = await pool.query(`
                SELECT * FROM messages WHERE id = $1`, [messageId]);

            await pool.query(`
                DELETE FROM messages WHERE conversation_id = $1 AND id = $2`, [conversationId, messageId]);
            
            res.send(message_deleted.rows);

    } catch (err) {
        res.status(500).json({error: 'server error', details: err.message});
    }
});

module.exports = conversationsRouter;