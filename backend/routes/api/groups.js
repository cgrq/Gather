// backend/routes/api/groups.js
const express = require('express');

const { Op } = require('sequelize');
const { Group, Membership, Attendance, EventImage, GroupImage, User, Venue, Event } = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyCohostStatus } = require('../../utils/auth')
const { formatDate, parseDate } = require('../../utils/date')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(["In person", "Online"])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    handleValidationErrors
];

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

const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .notEmpty()
        .custom(async id => {
            const venue = await Venue.findByPk(id);
            if(!venue){
                throw new Error('Venue does not exist');
            }
            return true;
        })
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
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
        .isDecimal()
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('startDate')
        .exists({ checkFalsy: true })
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
            include: [{ model: Membership }, { model: GroupImage, attributes: ["url"] }]
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
                previewImage
            }
        })

        return res.json({
            Groups: groupsFormatted
        });
    }
);

// Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res, next) => {

        const { user } = req;

        const groups = await Group.unscoped().findAll({
            where: { organizerId: user.id },
            include: [{ model: Membership }, { model: GroupImage, attributes: ["url"] }]
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
                previewImage
            }
        })

        return res.json({
            Groups: groupsFormatted
        });
    }
);

// Get details of a Group from an id
router.get(
    '/:groupId',
    async (req, res, next) => {

        const { groupId } = req.params;

        try {
            const group = await Group.unscoped().findByPk(groupId,
                {
                    include: [
                        { model: Membership },
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
            const Venues = group.Venues;

            const createdAtFormatted = formatDate(createdAt);
            const updatedAtFormatted = formatDate(updatedAt);

            groupsFormatted = {
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
                Organizer,
                Venues
            }


            return res.json({
                Groups: groupsFormatted
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
    requireAuth,
    async (req, res, next) => {

        const { groupId } = req.params;
        const { url, preview } = req.body;

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


            const groupImage = await GroupImage.create({ groupId, url, preview });

            return res.json({
                id: groupImage.id,
                url,
                preview
            });

        } catch (err) {
            next(err)
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

            group.set({ name, about, type, private, city, state });

            await group.save();

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
            if (!events.length) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }
            const eventsFormatted = events.map(event => {
                const { id, groupId, venueId, name, type, startDate, endDate } = event;
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

            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

            const event = await Event.create({ groupId, venueId, name, type, capacity, price, description, startDate, endDate });

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
    async (req, res, next) => {

        const { groupId } = req.params;

        try {
            const user = await User.unscoped().findByPk(req.user.id, {
                include: [{ model: Membership, where: { groupId }, attributes: ["status"] }]
            });

            if (!user) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const userStatus = user.Memberships[0].status;

            const memberships =
                (userStatus === "member" || userStatus === "pending")
                    ? await Membership.unscoped().findAll(
                        {
                            where: {
                                groupId,
                                status: {
                                    [Op.in]: ["co-host", "host"]
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

            const { memberId, status } = req.body;

            const existingMembership = await Membership.unscoped().findOne({ where: { userId: memberId, groupId } });

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
            const member = await User.findByPk(memberId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            if (!member) {
                const err = Error("Validations Error");
                err.errors = {
                    status: "User couldn't be found"
                }
                err.statusCode = 400;
                next(err);
            }

            const memberMembership = await Membership.unscoped().findOne({ where: { userId:memberId, groupId } });

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

            if (status === "pending") {
                const err = Error("Validations Error");
                err.errors = {
                    status: "Cannot change a membership status to pending"
                }
                err.statusCode = 400;
                next(err);
            }



            group.set({ userId, memberId, status });

            await group.save();

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
            const member = await User.findByPk(memberId);

            if (!group) {
                const err = new Error("Group couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            if (!member) {
                const err = Error("Validations Error");
                err.errors = {
                    status: "User couldn't be found"
                }
                err.statusCode = 400;
                next(err);
            }

            const memberMembership = await Membership.unscoped().findOne({ where: { userId:memberId, groupId } });

            if (!memberMembership) {
                const err = new Error("Membership does not exist for this User");
                err.statusCode = 404;
                return next(err);
            }

            const userMembership = await Membership.unscoped().findOne({ where: { userId, groupId } });
            console.log(`🖥 ~ file: groups.js:848 ~ userMembership:`, userMembership)


            if (!userMembership || userMembership.status !== "organizer(host)" || memberId != userId) {
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
