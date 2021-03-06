const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../model/user')
// const Brag = require('../Models/brag')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile)
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) return cb(err)
        if (user) {
          return cb(null, user)
        } else {
          // we have a new user via OAuth!
          var newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value
          })
          newUser.save(err => {
            if (err) return cb(err)
            return cb(null, newUser)
          })
        }
      })
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})