"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require("../models/userModel");

// fake database: ****************
const users = [
  {
    user_id: 1,
    name: "Foo Bar",
    email: "foo@bar.fi",
    password: "foobar"
  },
  {
    user_id: 2,
    name: "Bar Foo",
    email: "bar@foo.fi",
    password: "barfoo"
  }
];
// *******************

// fake database functions *********
const getUser = id => {
  const user = users.filter(usr => {
    if (usr.user_id === id) {
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = email => {
  const user = users.filter(usr => {
    if (usr.email === email) {
      console.log("user is: " + usr.name);
      return usr;
    }
  });
  return user[0];
};
// *****************

// serialize: store user id in session
passport.serializeUser((id, done) => {
  console.log("serialize", id);
  done(null, id);
});

// deserialize: get user id from session and get all user data
passport.deserializeUser(async (id, done) => {
  const user = getUser(id);
  console.log("deserialize", user);
  done(null, user);
});

passport.use(
  new Strategy(async (username, password, done) => {
    const params = username;
    console.log(params);
    try {
      const user = await getUserLogin(params);
      console.log("Local strategy", user); // result is binary row
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user.user_id);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    (jwtPayload, done) => {
      done(null, userModel.getUser(jwtPayload.user_id));
      return userModel.getUser(jwtPayload.user_id);
    }
  )
);

module.exports = passport;
