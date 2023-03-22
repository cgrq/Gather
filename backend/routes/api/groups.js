// backend/routes/api/session.js
const express = require('express');
const { Op, sequelize } = require('sequelize');

const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth')
const { formatDate } = require('../../utils/date')

const router = express.Router();

const validateGroup = [
    check('email')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isEmail()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
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

        const { id, organizerId, name, about, type, private, city, state, createdAt, updatedAt } = group;
        const Organizer = await User.unscoped().findByPk(organizerId, {
            attributes:["id", "firstName", "lastName"]
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
            Venues,
            text: "text"
        }


        return res.json({
            Groups: groupsFormatted
        });
    }
);

module.exports = router;
