const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db');
const bcrypt = require('bcrypt');

const initializePassport = ()=>{passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                console.log('Attempting to find user with email:', email);
                
                const userResult = await pool.query(
                    'SELECT * FROM users WHERE email = $1',
                    [email]
                );

                console.log('Database query result:', {
                    userFound: userResult.rows.length > 0
                });

                if (userResult.rows.length < 1) {
                    console.log('User not found');
                    return done(null, false, { message: "Incorrect Email" });
                }

                const user = userResult.rows[0];
                console.log('Found user, comparing passwords');
                
                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                console.log('Password comparison result:', isPasswordCorrect);

                if (!isPasswordCorrect) {
                    console.log('Password incorrect');
                    return done(null, false, { message: 'Incorrect Password' });
                }

                console.log('Authentication successful');
                return done(null, user);
            } catch (err) {
                console.error('Authentication error:', err);
                return done(err);
            }
        }
    )
);}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});
module.exports = initializePassport;