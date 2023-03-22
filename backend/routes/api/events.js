// backend/routes/api/venues.js
const express = require('express');

const { Group, Attendance, EventImage, Venue, Event} = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyCohostStatus } = require('../../utils/auth');
const { formatDate } = require('../../utils/date');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateEvent = [
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

// Get All Events
router.get(
    '/',
    async (_req, res) => {
        const event = await Event.unscoped().findAll({
            include: [
                { model: Attendance},
                { model: EventImage},
                { model: Group, attributes: ["id", "name", "city", "state"] },
                { model: Venue, attributes: ["id", "city", "state"] }
            ]
        });

        const eventsFormatted = event.map(event => {
            const { id, groupId, venueId, name, type, startDate, endDate } = event;
            console.log(`🖥 ~ file: events.js:52 ~ eventsFormatted ~ event:`, event)
            const numAttending = event.Attendances.length;
            const previewImage = event.EventImages[0].url;
            const Group = event.Group;
            const Venue = event.Venue;

            const startDateFormatted = formatDate(startDate);
            const endDateFormatted = formatDate(endDate);

            return {
                id,
                groupId,
                venueId,
                name,
                type,
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                numAttending,
                previewImage,
                Group,
                Venue
            }
        })

        return res.json({
            Events: eventsFormatted
        });
    }
);


module.exports = router;
