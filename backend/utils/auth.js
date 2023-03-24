// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Membership, Group, Venue, Event } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}

const verifyCohostStatus = async function (req, _res, next) {
  let inputGroupId = req.params.groupId;
  let venueId = req.params.venueId;
  let eventId = req.params.eventId;

  if(!inputGroupId && venueId){
    const venue = await Venue.unscoped().findByPk(venueId)
    if (!venue) {
      const err = new Error("Venue couldn't be found");
      err.statusCode = 404;
      return next(err);
    }
    inputGroupId = venue.groupId;
  }

  if(!inputGroupId && eventId){
    const event = await Event.unscoped().findByPk(eventId)
    if (!event) {
      const err = new Error("Event couldn't be found");
      err.statusCode = 404;
      return next(err);
    }
    inputGroupId = event.groupId;
  }

  const group = await Group.findByPk(inputGroupId);

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.statusCode = 404;
    return next(err);
  }

  const user = await User.unscoped().findByPk(req.user.id, { include: [{ model: Membership }] });
  let statusConfirmed = false;
  user.Memberships.forEach(membership => {
    const { groupId, status } = membership
    if (inputGroupId == groupId && (status == "organizer(host)" || status == "co-host")) {
      statusConfirmed = true;
      return next();
    }
  })
  if (!statusConfirmed) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    return next(err);
  }
}

const verifyMemberStatus = async function (req, _res, next) {
  let inputGroupId = req.params.groupId;
  let venueId = req.params.venueId;
  let eventId = req.params.eventId;

  if(!inputGroupId && venueId){
    const venue = await Venue.unscoped().findByPk(venueId)
    if (!venue) {
      const err = new Error("Venue couldn't be found");
      err.statusCode = 404;
      return next(err);
    }
    inputGroupId = venue.groupId;
  }

  if(!inputGroupId && eventId){
    const event = await Event.unscoped().findByPk(eventId)
    if (!event) {
      const err = new Error("Event couldn't be found");
      err.statusCode = 404;
      return next(err);
    }
    inputGroupId = event.groupId;
  }

  const group = await Group.findByPk(inputGroupId);

  if (!group) {
    const err = new Error("Group couldn't be found");
    err.statusCode = 404;
    return next(err);
  }

  const user = await User.unscoped().findByPk(req.user.id, { include: [{ model: Membership }] });
  let statusConfirmed = false;
  user.Memberships.forEach(membership => {
    const { groupId, status } = membership
    if (inputGroupId == groupId && (status == "organizer(host)" || status == "co-host" || status == "member")) {
      statusConfirmed = true;
      return next();
    }
  })
  if (!statusConfirmed) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    return next(err);
  }
}




module.exports = { setTokenCookie, restoreUser, requireAuth, verifyCohostStatus, verifyMemberStatus };
