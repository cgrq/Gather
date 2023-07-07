// backend/routes/api/venues.js
const express = require('express');

const { Op } = require('sequelize');

const { Group, User, Membership, Attendance, EventImage, Venue, Event } = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyMemberStatus, verifyCohostStatus } = require('../../utils/auth');
const { formatDate, parseDate } = require('../../utils/date');
const moment = require('moment');
const { check, query } = require('express-validator');
const { handleValidationErrors, isValidURL } = require('../../utils/validation');
const { singleMulterUpload, singleFileUpload } = require('../../awsS3');

const validateEvent = [
    check('name')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isLength({ min: 5, max: 50 })
        .withMessage('Name must be between 5 and 50 characters'),

    check('type')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),

    check('capacity')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage("Capacity must be an integer"),

    check('price')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage("Price is invalid"),

    check('description')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 30, max: 255 })
        .withMessage('Description must be between 30 and 255 characters'),

    check('startDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .custom(date => {
            console.log(`🖥 ~ file: events.js:53 ~ date:`, date)
            const startDate = moment(date, 'YYYY-MM-DDTHH:mm');
            console.log(`🖥 ~ file: events.js:54 ~ startDate:`, startDate)
            if (!startDate.isValid()) {
                throw new Error('Invalid start date');
            }
            console.log(`🖥 ~ file: events.js:58 ~ startDate:`, startDate)
            console.log(`🖥 ~ file: events.js:59 ~ moment():`, moment())
            if (startDate <= moment()) {
                throw new Error('Start date must be in the future 1');
            }
            return true;
        })
        .withMessage("Start date must be in the future 2"),

    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .custom((date, { req }) => {
            const endDate = moment(date, 'YYYY-MM-DDTHH:mm');
            const startDate = moment(req.body.startDate, 'YYYY-MM-DDTHH:mm');
            if (!endDate.isValid()) {
                throw new Error('Invalid end date');
            }
            if (endDate <= startDate) {
                throw new Error('End date is less than start date');
            }
            return true;
        })
        .withMessage("End date is less than start date"),

    handleValidationErrors
];

const validateImage = [
    check('image')
      .custom(async (value, { req }) => {
        if (!req.file) {
          throw new Error('Image file is required');
        }
        return true;
      }),
    handleValidationErrors
  ];

const validateEventQueries = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 10 })
        .default(1)
        .withMessage('Page must be greater than or equal to 1'),
    query('size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .default(20)
        .withMessage('Size must be greater than or equal to 1'),
    query('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    query('type')
        .optional()
        .isString()
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),
    query('startDate')
        .optional()
        .isString()
        .custom(date => {
            const startDate = parseDate(date);
            if (isNaN(startDate.getTime())) {
                throw new Error('Start date must be a valid datetime');
            }
            return true;
        })
        .withMessage('Start date must be a valid datetime'),
    handleValidationErrors
];

const validateAttendance = [
    check('status')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isIn(["attending", "waitlist"])
        .withMessage("Status must be 'attending' or 'waitlist'"),
    handleValidationErrors
]
// Get All Events
router.get(
    '/',
    validateEventQueries,
    async (req, res) => {

        const { page = 1, size = 20, name, type, startDate } = req.query;

        let where = {};

        if (name) {
            where.name = name;
        }

        if (type) {
            where.type = type;
        }

        if (startDate) {
            where.startDate = startDate;
        }

        let pagination = {};

        const offset = size * (page - 1);

        pagination.limit = size;
        pagination.offset = offset;

        const options = {
            include: [
                { model: Attendance },
                { model: EventImage },
                { model: Group, attributes: ["id", "name", "city", "state"] },
                { model: Venue, attributes: ["id", "city", "state"] }
            ],
            ...pagination
        }

        if (Object.keys(where).length) options.where = where;

        const events = await Event.unscoped().findAll(options);

        const eventsFormatted = events.map(event => {
            const { id, groupId, venueId, name, type, startDate, endDate } = event;
            const numAttending = event.Attendances.length;
            const previewImage = event.EventImages[0] ? event.EventImages[0].url : "no image";
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

// Get details of an Event specified by its id
router.get(
    '/:eventId',
    async (req, res, next) => {

        const { eventId } = req.params;

        try {
            const event = await Event.unscoped().findByPk(eventId,
                {
                    include: [
                        { model: Attendance, include: [{ model: User }] },
                        { model: EventImage, attributes: ["id", "url", "preview"] },
                        { model: Group, attributes: ["id", "name", "private", "city", "state"] },
                        { model: Venue, attributes: ["id", "address", "city", "state", "lat", "lng"] }
                    ]
                }
            );
            if (!event) {
                const err = new Error("Event couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const { id, groupId, venueId, name, description, type, capacity, price, startDate, endDate } = event;
            const numAttending = event.Attendances.length;
            const Attendances = event.Attendances;
            const eventGroup = event.Group;
            const eventVenue = event.Venue;
            const EventImages = event.EventImages;

            const startDateFormatted = formatDate(startDate);
            const endDateFormatted = formatDate(endDate);

            const eventFormatted = {
                id,
                groupId,
                venueId,
                name,
                description,
                type,
                capacity,
                price,
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                numAttending,
                Attendances,
                Group: eventGroup,
                Venue: eventVenue,
                EventImages
            };

            return res.json(eventFormatted);
        } catch (err) {
            next(err)
        }

    }
);

// Edit a Event
router.put(
    '/:eventId',
    [requireAuth, verifyCohostStatus, validateEvent],
    async (req, res, next) => {

        try {
            console.log("!!!!!!!!!!!!!")
            const { eventId } = req.params;
            const { name, type, capacity, price, description, startDate, endDate } = req.body;

            const event = await Event.findByPk(eventId);
            console.log(`🖥 ~ file: events.js:271 ~ event:`, event)

            const { venueId } = event;
            console.log(`🖥 ~ file: events.js:274 ~ venueId:`, venueId)

            const venue = await Venue.unscoped().findByPk(venueId);

            if (!venue) {
                const err = new Error("Venue couldn't be found");
                err.statusCode = 404;
                return next(err);
            }

            const id = event.id;

            event.set({ venueId, name, type, capacity, price, description, startDate, endDate });

            await event.save();

            const startDateFormated = formatDate(event.startDate);
            const endDateFormatted = formatDate(event.endDate);

            return res.json({
                id,
                venueId,
                name,
                type,
                capacity,
                price,
                description,
                startDate: startDateFormated,
                endDate: endDateFormatted
            });
        } catch (err) {
            next(err)
        }

    }
);

// Create an EventImage for a Group specified by its id
router.post(
    '/:eventId/images',
    [singleMulterUpload("image"), requireAuth ,verifyMemberStatus, validateImage],
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const { preview } = req.body;
            const imageUrl = req.file
            ? await singleFileUpload({ file: req.file, public: true })
            : null;

            const eventImage = await EventImage.create({ eventId, url: imageUrl, preview });


            const id = eventImage.id;

            return res.json({ id, url: imageUrl, preview });

        } catch (err) {
            next(err)
        }
    }
);

// Edit a Event Image
router.put(
    '/:eventId/images/edit',
    [singleMulterUpload("image"), requireAuth, verifyCohostStatus],
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const { preview } = req.body;
            const imageUrl = req.file
            ? await singleFileUpload({ file: req.file, public: true })
            : null;

            const eventImage = await EventImage.findOne({ where: { eventId } });

            eventImage.set({ url:imageUrl, preview });

            await eventImage.save();

            const id = eventImage.id;


            return res.json({ id, url: imageUrl, preview });

        } catch (err) {
            next(err)
        }
    }
);


// Delete an Event
router.delete(
    '/:eventId',
    [requireAuth, verifyCohostStatus],
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const event = await Event.findByPk(eventId);

            await event.destroy();

            return res.json({
                message: "Successfully deleted"
            });
        } catch (err) {
            next(err)
        }

    }
);



// Get all Attendees of an Event specified by its id
router.get(
    '/:eventId/attendees',
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const userId = req.user.id;

            const event = await Event.unscoped().findByPk(eventId, {
                include: [
                    {
                        model: Group, include: [
                            { model: Membership, where: { userId } }
                        ]
                    }
                ]
            });

            if (!event) {
                const err = new Error("Event couldn't be found");
                err.statusCode = 404;
                throw err;
            }
            let userMemberStatus;
            if (event.Group) {
                userMemberStatus = event.Group.Memberships[0].status;
            }
            const attendees =
                (!userMemberStatus || userMemberStatus === "member" || userMemberStatus === "pending")
                    ? await Attendance.unscoped().findAll(
                        {
                            attributes: ["status"],
                            where: {
                                eventId,
                                status: {
                                    [Op.in]: ["attending", "waitlist"]
                                }
                            },
                            include: [
                                { model: User, attributes: ["id", "firstName", "lastName"] }
                            ]
                        }
                    )
                    : await Attendance.unscoped().findAll(
                        {
                            where: {
                                eventId
                            },
                            attributes: ["status"],
                            include: [
                                { model: User, attributes: ["id", "firstName", "lastName"] }
                            ]
                        }
                    );

            const attendeesFormatted = attendees.map(attendee => {
                const { status } = attendee;

                const { id, firstName, lastName } = attendee.User;

                return {
                    id,
                    firstName,
                    lastName,
                    Attendance: { status }
                }
            })

            return res.json({
                Attendees: attendeesFormatted
            });
        } catch (err) {
            next(err)
        }

    }
);

// Request Attendance to an Event
router.post(
    '/:eventId/attendance',
    requireAuth,
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const userId = req.user.id;

            const event = await Event.unscoped().findByPk(eventId, {
                include: [
                    {
                        model: Group, include: [
                            { model: Membership, where: { userId } }
                        ]
                    }
                ]
            });

            if (!event) {
                const err = new Error("Event couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            let userMemberStatus;

            if (event.Group) {
                userMemberStatus = event.Group.Memberships[0].status;
            }

            if (!userMemberStatus || userMemberStatus === "pending") {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            const attendee = await Attendance.unscoped().findOne({
                where: {
                    eventId,
                    userId
                }
            });


            if (attendee) {

                const status = attendee.status;
                if (status === "pending" || status === "waitlist") {
                    const err = new Error("Attendance has already been requested");
                    err.statusCode = 400;
                    throw err;
                }
                if (status === "attending") {
                    const err = new Error("User is already an attendee of the event");
                    err.statusCode = 400;
                    throw err;
                }
            }
            const status = "pending"

            await Attendance.create({ eventId, userId, status });

            return res.json({ userId, status });

        } catch (err) {
            next(err)
        }
    }
);

// Change the status of an attendance for an event specified by id
router.put(
    '/:eventId/attendance',
    [requireAuth, verifyCohostStatus],
    async (req, res, next) => {
        try {
            const { eventId } = req.params;

            const { memberId, status } = req.body;

            const event = await Event.unscoped().findByPk(eventId);

            if (!event) {
                const err = new Error("Event couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const attendee = await Attendance.unscoped().findOne({
                where: {
                    eventId,
                    id: memberId
                }
            });

            if (!attendee) {
                const err = new Error("Attendance between the user and the event does not exist");
                err.statusCode = 404;
                return next(err);
            }

            const id = event.id;

            attendee.set({ memberId, status });

            await attendee.save();

            return res.json({
                id,
                eventId: parseInt(eventId),
                memberId,
                status
            });

        } catch (err) {
            next(err)
        }

    }
);

// Delete attendance to an event specified by id
router.delete(
    '/:eventId/attendance',
    requireAuth,
    async (req, res, next) => {
        try {
            const { eventId } = req.params;
            const { userId } = req.body;
            const userCurrentId = req.user.id;

            const attendeeAttendance = await Attendance.unscoped().findOne({where: {id:userId, eventId}});

            const event = await Event.unscoped().findByPk(eventId, {
                include: [
                    { model: Group, include: [{ model: Membership, where: { userId:userCurrentId } }] }]
            });

            if (!event) {
                const err = new Error("Event couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            if (!attendeeAttendance) {
                const err = new Error("Attendance does not exist for this User");
                err.statusCode = 404;
                return next(err);
            }
            let userMemberStatus;


            if (event.Group) userMemberStatus = event.Group.Memberships[0].status

            if (!userMemberStatus || (userMemberStatus !== "organizer(host)" && userId != userCurrentId)) {
                const err = new Error("Only the User or organizer may delete an Attendance");
                err.statusCode = 403;
                throw err;
            }

            await attendeeAttendance.destroy();

            return res.json({
                message: "Successfully deleted attendance from event"
            });
        } catch (err) {
            next(err)
        }
    }

);


router.use((err, req, res, next) => {
    if (err.errors) {
        res.status(err.statusCode || 500).json({
            message: err.message,
            errors: err.errors
        });
    } else {
        res.status(err.statusCode || 500).json({ message: err.message });
    }
});

module.exports = router;
