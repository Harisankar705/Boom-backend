import passport from 'passport'
import User from '../models/User'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
passport.use(new GoogleStrategy({
    cliendId:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
},
async(accessToken,refreshToken,profile,done)=>{
    let user=await User.findOne({googleId:profile.id})
    if(!user)
    {
        user=await User.create({
            googleId:profile.id,
            username:profile.displayName,
            email:profile.emails[0].value
        })
    }
    return done(null,user)
}

))
passport.serializeUser((user,done)=>done(null,user.id))
passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>done(null,user))
})