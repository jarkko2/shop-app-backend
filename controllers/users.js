
const bcrypt = require('bcrypt');
const User = require('../models/User')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const validator = require('validator');

const { createUserControllerError } = require('../errors/usererror')
const asyncWrapper = require('../middleware/asyncErrors.js')
const { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } = require('http-status-codes')

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  console.log("hop")
  try {
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return cb(null, false, { message: 'Incorrect username or password.' })
    }
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}))

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.email })
  })
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user)
  })
})

const register = asyncWrapper(async (req, res, next) => {
  const { username, name, email, password, passwordConfirmation, role } = req.body
  const userExists = await User.findOne({ username })
  const emailExists = await User.findOne({ email })

  if (userExists) {
    return next(createUserControllerError(`User already exists with username: ${username}`, StatusCodes.CONFLICT))
  }
  if (emailExists) {
    return next(createUserControllerError('Email already in use!', StatusCodes.CONFLICT))
  }
  if (validator.isEmail(email) == false) {
    return next(createUserControllerError('Email is not valid!', StatusCodes.CONFLICT))
  }
  if (password != passwordConfirmation) {
    return next(createUserControllerError('Passwords does not match!', StatusCodes.CONFLICT))
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    email,
    name,
    passwordHash,
    role
  })

  const savedUser = await user.save()

  res.status(StatusCodes.OK).json({ savedUser })
})

const loginPassword = asyncWrapper(async (req, res, next) => {
  passport.authenticate('local', {
    //successRedirect: 'http://localhost:3000/',
    //failureRedirect: '/api/users/login',
    passReqToCallback: true
  })(req, res, () => {
    res.json({ auth: req.isAuthenticated() });
  });
});

const onlineCheck = asyncWrapper(async (req, res, next) => {
  console.log(req.user)
  if (req.user != null) {
    const user = await User.find({ email: req.user.username })
    res.json({ auth: req.isAuthenticated(), user: req.user, role: user[0].role });
  } else {
    res.json({ auth: req.isAuthenticated(), user: req.user, role: "notlogged" });
  }
});

const logout = asyncWrapper(async (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.json({ message: "Successfully logged out" });
  });
})

module.exports = { register, loginPassword, logout, onlineCheck }