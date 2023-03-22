// backend/routes/api/session.js
const express = require('express');
const { Op, sequelize } = require('sequelize');

const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');

const router = express.Router();

const { requireAuth } = require('../../utils/auth')
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


module.exports = router;
