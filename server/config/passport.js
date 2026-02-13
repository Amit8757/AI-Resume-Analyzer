import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy (only if credentials are configured)
console.log('Checking Google OAuth config...');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_ID value matches placeholder:', process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ providerId: profile.id, provider: 'google' });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link Google account to existing user
                    user.provider = 'google';
                    user.providerId = profile.id;
                    user.avatar = profile.photos[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'google',
                    providerId: profile.id,
                    avatar: profile.photos[0]?.value
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    ));
    console.log('✓ Google OAuth configured');
} else {
    console.log('⊘ Google OAuth not configured - skipping');
}

// LinkedIn OAuth Strategy (only if credentials are configured)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_ID !== 'your_linkedin_client_id_here') {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ providerId: profile.id, provider: 'linkedin' });

                if (user) {
                    return done(null, user);
                }

                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    user.provider = 'linkedin';
                    user.providerId = profile.id;
                    user.avatar = profile.photos[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'linkedin',
                    providerId: profile.id,
                    avatar: profile.photos[0]?.value
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    ));
    console.log('✓ LinkedIn OAuth configured');
} else {
    console.log('⊘ LinkedIn OAuth not configured - skipping');
}

// GitHub OAuth Strategy (only if credentials are configured)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'your_github_client_id_here') {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ providerId: profile.id, provider: 'github' });

                if (user) {
                    return done(null, user);
                }

                const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
                user = await User.findOne({ email });

                if (user) {
                    user.provider = 'github';
                    user.providerId = profile.id;
                    user.avatar = profile.photos[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName || profile.username,
                    email,
                    provider: 'github',
                    providerId: profile.id,
                    avatar: profile.photos[0]?.value
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    ));
    console.log('✓ GitHub OAuth configured');
} else {
    console.log('⊘ GitHub OAuth not configured - skipping');
}

export default passport;
