// backend/routes/api/venues.js
const express = require('express');

const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyCohostStatus } = require('../../utils/auth')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];
console.log("!@!@#!@#!@#!!")
// Edit a Venue specified by its id
router.put(
    '/:venueId',
    [requireAuth, verifyCohostStatus, validateVenue],
    async (req, res, next) => {
        try {
            const { venueId } = req.params;

            const { address, city, state, lat, lng } = req.body;

            const venue = await Venue.unscoped().findByPk(venueId)

            venue.update({ address, city, state, lat, lng });

            const id = venue.id;
            const groupId = venue.groupId;

            return res.json({ id, groupId, address, city, state, lat, lng });

        } catch (err) {
            next(err)
        }
    }
);


module.exports = router;
