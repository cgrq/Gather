// backend/routes/api/venues.js
const express = require('express');

const { Op } = require('sequelize');

const { Group, GroupImage, User, Membership, Attendance, EventImage, Venue, Event } = require('../../db/models');

const router = express.Router();


// Delete an Image for a Group
router.delete(
    '/:imageId',
    async (req, res, next) => {
        try {
            const { imageId } = req.params;
            const userId = req.user.id;

            const image = await GroupImage.findByPk(imageId, {
                include: [
                    { model: Group, include: [{ model: Membership, where: { userId } }] }]
            });

            if (!image) {
                const err = new Error("Group Image couldn't be found");
                err.statusCode = 404;
                throw err;
            }
            let userMemberStatus;

            if(image.Group) userMemberStatus = image.Group.Memberships[0].status

            console.log(`🖥 ~ file: group-images.js:31 ~ userMemberStatus:`, userMemberStatus)

            if (userMemberStatus || userMemberStatus === "organizer(host)" || userMemberStatus === "co-host") {
                await image.destroy();

                return res.json({
                    message: "Successfully deleted"
                });
            }

            const err = new Error("Forbidden");
            err.statusCode = 403;
            throw err;

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
