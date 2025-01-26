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
