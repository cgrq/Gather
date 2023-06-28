// backend/routes/api/groups.js
const express = require('express');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");
const { Op } = require('sequelize');
const { Group, Membership, Attendance, EventImage, GroupImage, User, Venue, Event } = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyCohostStatus } = require('../../utils/auth')
const { formatDate, parseDate } = require('../../utils/date')
const { check } = require('express-validator');
const { handleValidationErrors, isValidURL } = require('../../utils/validation');


const validateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .trim()
        .isLength({ min: 30, max: 255 })
        .withMessage('About must be between 30 and 255 characters'),
    check('type')
        .exists({ checkFalsy: true })
        .trim()
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .trim()
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("City is required")
        .isLength({ max: 60 })
        .withMessage('City must be 60 characters or less'),
    check('state')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("State is required")
        .isLength({ max: 60 })
        .withMessage('State must be 60 characters or less'),
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

const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("State is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .trim()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .trim()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    handleValidationErrors
];

const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .custom(async id => {
            const venue = await Venue.findByPk(id);
            if (!venue) {
                throw new Error('Venue does not exist');
            }
            return true;
        })
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isLength({ min: 5, max: 50 })
        .withMessage('Name must be between 5 and 50 characters'),
    check('type')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .exists({ checkFalsy: true })
        .trim()
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists()
        .trim()
        .custom(value => typeof value !== 'undefined')
        .isInt()
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 5, max: 255 })
        .withMessage('Description must be between 5 and 255 characters'),
    check('startDate')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .custom(date => {
            const startDate = parseDate(date);
            if (startDate <= new Date()) {
                throw new Error('Start date must be in the future');
            }
            return true;
        })
        .withMessage("Start date must be in the future"),
    check('endDate')
        .exists({ checkFalsy: true })
        .trim()
        .notEmpty()
        .custom((date, { req }) => {
            const endDate = parseDate(date);
            const startDate = parseDate(req.body.startDate);
            if (endDate <= startDate) {
                throw new Error('End date is less than start date');
            }
            return true;
        })
        .withMessage("End date is less than start date"),
    handleValidationErrors
];

// Get All Groups
router.get(
    '/',
    async (_req, res) => {
        const groups = await Group.unscoped().findAll({
            include: [{ model: Event, include: [{ model: EventImage }, { model: Venue, attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"] }] }, { model: Membership }, { model: GroupImage, attributes: ["url"] }]
        });

        const groupsFormatted = groups.map(group => {
            const { id, organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group;
            const numMembers = group.Memberships.length;
            const previewImage = group.GroupImages[0] ? group.GroupImages[0].url : "no image";

            const createdAtFormatted = formatDate(createdAt);
            const updatedAtFormatted = formatDate(updatedAt);

            return {
                id,
                organizerId,
                name,
                about,
                type,
                private,
                city,
                state,
                createdAt: createdAtFormatted,
                updatedAt: updatedAtFormatted,
                numMembers,
                Events: group.Events,
                Memberships: group.Memberships,
                Venues: group.Venues,
                previewImage
            }
        })

        return res.json({
            Groups: groupsFormatted
        });
    }
);

// Get all Groups organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const groups = await Group.unscoped().findAll({
        where: { organizerId: user.id },
        include: [
            { model: Event, include: [{ model: EventImage }] },
            { model: Membership },
            { model: GroupImage, attributes: ["url"] }
        ],
        order: [[Event, 'startDate', 'DESC']]
    });

    const groupsFormatted = groups.map(group => {
        const { id, organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group;
        const numMembers = group.Memberships.length;
        const previewImage = group.GroupImages[0] ? group.GroupImages[0].url : "no image";

        const createdAtFormatted = formatDate(createdAt);
        const updatedAtFormatted = formatDate(updatedAt);

        return {
            id,
            organizerId,
            name,
            about,
            type,
            private,
            city,
            state,
            createdAt: createdAtFormatted,
            updatedAt: updatedAtFormatted,
            numMembers,
            Events: group.Events,
            Memberships: group.Memberships,
            previewImage
        };
    });

    return res.json({
        Groups: groupsFormatted
    });
});

// Get details of a Group from an id
router.get(
    '/:groupId',
    async (req, res, next) => {

        const { groupId } = req.params;

        try {
            const group = await Group.unscoped().findByPk(groupId,
                {
                    include: [
                        { model: Membership, include: [{ model: User }] },
                        { model: GroupImage },
                        { model: User, attributes: ["id", "firstName", "lastName"] },
                        { model: GroupImage, attributes: ["id", "url", "preview"] },
                        { model: Venue, attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"] }
                    ]
                }
            );

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }
            const { id, organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group;
            const Organizer = await User.unscoped().findByPk(organizerId, {
                attributes: ["id", "firstName", "lastName"]
            })

            const numMembers = group.Memberships.length;
            const GroupImages = group.GroupImages;
            const Memberships = group.Memberships;
            const Venues = group.Venues;

            const createdAtFormatted = formatDate(createdAt);
            const updatedAtFormatted = formatDate(updatedAt);

            groupFormatted = {
                id,
                organizerId,
                name,
                about,
                type,
                private,
                city,
                state,
                createdAt: createdAtFormatted,
                updatedAt: updatedAtFormatted,
                numMembers,
                GroupImages,
                Memberships,
                Organizer,
                Venues
            }

            return res.json({
                ...groupFormatted
            });
        } catch (err) {
            next(err)
        }

    }
);

// Create a Group
router.post(
    '/',
    [requireAuth, validateGroup],
    async (req, res, next) => {

        const { user } = req;

        const { name, about, type, private, city, state } = req.body;
        const organizerId = user.id;

        const group = await Group.create({ organizerId, name, about, type, private, city, state });

        const id = group.id;
        const createdAt = formatDate(group.createdAt);
        const updatedAt = formatDate(group.updatedAt);

        await Membership.create({ userId: organizerId, groupId: id, status: "organizer(host)" });

        return res.json({
            id,
            organizerId,
            name,
            about,
            type,
            private,
            city,
            state,
            createdAt,
            updatedAt
        });
    }
);


// Add an Image to a Group based on the Group's id
router.post(
    '/:groupId/images',
    [singleMulterUpload("image"), requireAuth,  validateImage],
    async (req, res, next) => {

        const { groupId } = req.params;
        const { preview } = req.body
        const imageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
         null;

        try {
            const group = await Group.findByPk(groupId, {
                include: [{ model: User }]
            });

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            if (group.organizerId != req.user.id) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            const groupImage = await GroupImage.create({ groupId, url:imageUrl, preview });

            return res.json({
                id: groupImage.id,
                url:imageUrl,
                // preview: true
            });

        } catch (err) {
            next(err)
        }
    }
);

// Update an Image to a Group based on the Group's id
router.put(
    '/:groupId/images',
    [singleMulterUpload("image"), requireAuth, validateImage],
    async (req, res, next) => {
        const { groupId } = req.params;
        const { preview } = req.body;
        const imageUrl = req.file
            ? await singleFileUpload({ file: req.file, public: true })
            : null;

        try {
            const group = await Group.findByPk(groupId, {
                include: [{ model: User }],
            });

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            if (group.organizerId != req.user.id) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            const groupImage = await GroupImage.findOne({ where: { groupId } });

            if (!groupImage) {
                const err = new Error("GroupImage couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            // Update the GroupImage record with the new values
            groupImage.url = imageUrl;
            groupImage.preview = preview;
            await groupImage.save();

            return res.json({
                id: groupImage.id,
                url: imageUrl,
                preview,
            });
        } catch (err) {
            next(err);
        }
    }
);


// Edit a Group
router.put(
    '/:groupId',
    [requireAuth, validateGroup],
    async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { name, about, type, private, city, state } = req.body;
            const userId = req.user.id;

            const group = await Group.findByPk(groupId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const organizerId = group.organizerId;

            if (organizerId != userId) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            group.set({ name, about, type, private, city, state });

            await group.save();

            const id = group.id;
            const createdAt = formatDate(group.createdAt);
            const updatedAt = formatDate(group.updatedAt);

            return res.json({
                id,
                organizerId,
                name,
                about,
                type,
                private,
                city,
                state,
                createdAt,
                updatedAt
            });
        } catch (err) {
            next(err)
        }

    }
);

// Delete a Group
router.delete(
    '/:groupId',
    requireAuth,
    async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const id = req.user.id;

            const group = await Group.findByPk(groupId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const organizerId = group.organizerId;

            if (organizerId != id) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            await group.destroy();


            return res.json({
                message: "Successfully deleted"
            });
        } catch (err) {
            next(err)
        }

    }
);

// Get All Venues for a Group specified by its id
router.get(
    '/:groupId/venues',
    [requireAuth, verifyCohostStatus],
    async (req, res, next) => {
        try {
            const parentGroupId = req.params.groupId;
            const userId = req.user.id;

            const group = await Group.unscoped().findByPk(parentGroupId,
                {
                    include: [
                        { model: Venue, attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"] }
                    ]
                }
            );

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const Venues = group.Venues.map(venue => {
                const { id, groupId, address, city, state, lat, lng } = venue;
                return { id, groupId, address, city, state, lat, lng };
            })

            return res.json({
                Venues
            });

        } catch (err) {
            next(err)
        }


    }
);



// Create a new Venue for a Group specified by its id
router.post(
    '/:groupId/venues',
    [requireAuth, verifyCohostStatus, validateVenue],
    async (req, res, next) => {
        try {
            const { groupId } = req.params;

            const { address, city, state, lat, lng } = req.body;

            const venue = await Venue.create({ groupId, address, city, state, lat, lng });

            const id = venue.id;

            return res.json({ id, groupId, address, city, state, lat, lng });

        } catch (err) {
            next(err)
        }
    }
);

// Get all Events of a Group specified by its id
router.get(
    '/:groupId/events',
    async (req, res, next) => {

        const parentGroupId = req.params.groupId;

        try {
            const group = await Group.unscoped().findByPk(parentGroupId)

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const events = await Event.unscoped().findAll(
                {
                    where: {
                        groupId: parentGroupId
                    },
                    include: [
                        { model: Attendance },
                        { model: EventImage },
                        { model: Group, attributes: ["id", "name", "city", "state"] },
                        { model: Venue, attributes: ["id", "city", "state"] }
                    ]
                }
            );

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
        } catch (err) {
            next(err)
        }

    }
);


// Create an Event for a Group specified by its id
router.post(
    '/:groupId/events',
    [requireAuth, verifyCohostStatus, validateEvent],
    async (req, res, next) => {
        try {
            const { groupId } = req.params;

            const userId = req.user.id;

            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

            const event = await Event.create({ groupId, venueId, name, type, capacity, price, description, startDate, endDate });

            await Attendance.create({ eventId: event.id, userId, status: "attending" })

            const id = event.id;

            return res.json({ id, groupId: parseInt(groupId), venueId, name, type, capacity, price, description, startDate, endDate });

        } catch (err) {
            next(err)
        }
    }
);

// Get all Members of a Group specified by its id
router.get(
    '/:groupId/members',
    requireAuth,
    async (req, res, next) => {

        const { groupId } = req.params;

        try {

            const group = await Group.findByPk(groupId);
            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }
            const user = await User.unscoped().findByPk(req.user.id, {
                include: [{ model: Membership, where: { groupId }, attributes: ["status"] }]
            });

            const userStatus = (user && user.Memberships[0]) ? user.Memberships[0].status : null;

            const memberships =
                (userStatus === "member" || userStatus === "pending")
                    ? await Membership.unscoped().findAll(
                        {
                            where: {
                                groupId,
                                status: {
                                    [Op.in]: ["co-host", "organizer(host)"]
                                }
                            },
                            include: [
                                { model: User, attributes: ["id", "firstName", "lastName"] }
                            ]
                        }
                    )
                    : await Membership.unscoped().findAll(
                        {
                            where: {
                                groupId
                            },
                            include: [
                                { model: User, attributes: ["id", "firstName", "lastName"] }
                            ]
                        }
                    );

            const membershipFormatted = memberships.map(membership => {
                const { status } = membership;

                const { id, firstName, lastName } = membership.User;

                if (status === "member" || status === "pending") {

                }
                return {
                    id,
                    firstName,
                    lastName,
                    Membership: { status }
                }
            })

            return res.json({
                Members: membershipFormatted
            });
        } catch (err) {
            next(err)
        }

    }
);

// Request a Membership for a Group based on the Group's id
router.post(
    '/:groupId/membership',
    [requireAuth],
    async (req, res, next) => {
        try {
            const { groupId } = req.params;

            const group = await Group.unscoped().findByPk(groupId)
            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                return next(err);
            }

            const memberId = req.user.id;

            const existingMembership = await Membership.unscoped().findOne({ where: { id: memberId, groupId } });

            if (existingMembership) {
                const { status } = existingMembership;

                if (status === "pending") {
                    const err = new Error("Membership has already been requested");
                    err.statusCode = 400;
                    throw err;
                } else {
                    const err = new Error("User is already a member of the group");
                    err.statusCode = 400;
                    throw err;
                }
            }

            const status = "pending"

            const membership = await Membership.create({ userId: memberId, groupId, status });

            return res.json({ memberId, status });

        } catch (err) {
            next(err)
        }
    }
);

// Change the status of a membership for a group specified by id
router.put(
    '/:groupId/membership',
    [requireAuth, verifyCohostStatus],
    async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { memberId, status } = req.body;
            const userId = req.user.id;

            const group = await Group.findByPk(groupId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const memberMembership = await Membership.unscoped().findOne({ where: { id: memberId, groupId } });

            if (!memberMembership) {
                const err = new Error("Membership between the user and the group does not exist");
                err.statusCode = 404;
                return next(err);
            }

            const userMembership = await Membership.unscoped().findOne({ where: { userId, groupId } });


            if (!userMembership || (status === "co-host" && userMembership.status !== "organizer(host)")) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            memberMembership.set({ status });

            await memberMembership.save();

            return res.json({
                id: userId,
                groupId: parseInt(groupId),
                memberId,
                status
            });
        } catch (err) {
            next(err)
        }

    }
);

// Delete membership to a group specified by id
router.delete(
    '/:groupId/membership',
    requireAuth,
    async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { memberId } = req.body;
            const userId = req.user.id;

            const group = await Group.findByPk(groupId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const memberMembership = await Membership.unscoped().findOne({ where: { id: memberId, groupId } });

            if (!memberMembership) {
                const err = new Error("Membership does not exist for this User");
                err.statusCode = 404;
                return next(err);
            }

            const userMembership = await Membership.unscoped().findOne({ where: { userId, groupId } });


            if (!userMembership || (userMembership.status !== "organizer(host)" && memberId != userId)) {
                const err = new Error("Forbidden");
                err.statusCode = 403;
                throw err;
            }

            await memberMembership.destroy();

            return res.json({
                message: "Successfully deleted membership from group"
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
