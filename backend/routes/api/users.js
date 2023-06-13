const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Middleware
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Invalid email")
        .custom(async email => {
            const existingUser = await User.unscoped().findOne({
                where: { email }
            });
            if (existingUser) {
                throw new Error('User with that email already exists')
            }
        })
        .withMessage("User with that email already exists"),
    check('username')
        .exists({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be 3 characters or more')
        .custom(async username => {
            const existingUser = await User.unscoped().findOne({
                where: { username }
            });
            if (existingUser) {
                throw new Error('User with that username already exists')
            }
        })
        .withMessage("User with that username already exists"),
    check('password')
        .exists({ checkFalsy: true })
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more'),
    check('firstName')
        .exists({ checkFalsy: true })
        .trim()
        .withMessage('First Name is required')
        .isLength({ min: 2 })
        .withMessage('First Name must be 2 characters or more'),
    check('lastName')
        .exists({ checkFalsy: true })
        .trim()
        .withMessage('Last Name is required')
        .isLength({ min: 2 })
        .withMessage('Last Name must be 2 characters or more'),
    handleValidationErrors
];

// Sign up
router.post(
    '',
    validateSignup,
    async (req, res) => {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const existingUser = await User.unscoped().findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingUser) {
            const err = new Error("User already exists");
            err.statusCode = 500;
            err.errors = {};

            if (username == existingUser.username) {
                err.errors.username = "User with that username already exists";
            }
            if (email == existingUser.email) {
                err.errors.email = "User with that email already exists";
            }
            throw err;
        }

        const user = await User.create({ username, email, firstName, lastName, hashedPassword });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
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
