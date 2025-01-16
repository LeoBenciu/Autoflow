const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const pool = require('../db');

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const strategyConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/users/auth/google/callback',
    scope: ['profile', 'email']
};

passport.use(
    new GoogleStrategy(strategyConfig,
        async(accessToken, refreshToken, profile, done)=>{
            try{
                const existingUser = await pool.query(
                    `SELECT * FROM users WHERE email = $1`, [profile.emails[0].value]);
                
                if(existingUser.rows.length > 0){
                    return done(null, existingUser.rows[0]);
                }

                function take_number(data){
                    return data.rows.map(element => element.max).join(',');
                   };

                const last_user = await pool.query(`SELECT max(id) FROM users;`);
                const last_user_id = last_user? take_number(last_user): 0;
                const userId = Number(last_user_id) + 1;

                const newUser = await pool.query(
                    `INSERT INTO users (id,username, email, profile_img, created_at)
                    VALUES ($1,$2,$3,$4,NOW()) RETURNING *`,
                    [userId, profile.displayName, profile.emails[0].value, profile.photos[0].value])

                return done(null, newUser.rows[0]);
            } catch(err){
                return done(err, null);
            }
        }
    )
);

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const user = result.rows[0];
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
