const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = 'your_secret_key'; // Use an environment variable in production

exports.signUp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await models.User.create({ email, password: hashedPassword });
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await models.User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Authentication failed' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.signOut = async (req, res) => {
    // Realistically, you would manage token invalidation here.
    res.status(200).send({ message: 'Successfully logged out' });
};

exports.getSession = async (req, res) => {
    try {
        const user = await models.User.findByPk(req.user.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
