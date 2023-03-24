// backend/routes/api/venues.js
const express = require('express');

const { Op } = require('sequelize');

const { Group, User, Membership, Attendance, EventImage, Venue, Event } = require('../../db/models');

const router = express.Router();


// Delete an Image for a Group
router.delete(
    '/:imageId',
    async (req, res, next) => {
        try {
            const { imageId } = req.params;
            const userId = req.user.id;

            const image = await EventImage.findByPk(imageId, {
                include: [
                    {model: Event, include:[
                        { model: Group, include: [{ model: Membership, where: { userId }}] }
                    ]}

                ]
            });
            console.log(`🖥 ~ file: event-images.js:27 ~ image:`, image)

            if (!image) {
                const err = new Error("Event Image couldn't be found");
                err.statusCode = 404;
                throw err;
            }

            const userMemberStatus = image.Group.Memberships[0].status;
            console.log(`🖥 ~ file: group-images.js:31 ~ userMemberStatus:`, userMemberStatus)

            if (userMemberStatus === "organizer(host)" || userMemberStatus === "co-host") {
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


module.exports = router;
