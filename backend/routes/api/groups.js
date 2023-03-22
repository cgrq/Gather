// backend/routes/api/groups.js
const express = require('express');


const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');

const router = express.Router();

const { requireAuth, verifyCohostStatus } = require('../../utils/auth')
const { formatDate } = require('../../utils/date')
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
            const previewImage = group.GroupImages[0].url;

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
            const previewImage = group.GroupImages[0].url;

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

router.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
})
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

router.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
});

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



module.exports = router;
