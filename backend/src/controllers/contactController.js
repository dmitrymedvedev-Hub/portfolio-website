const db = require('../config/database');

async function submitContact(req, res, next) {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        const sanitizedName = String(name).trim();
        const sanitizedEmail = String(email).trim();
        const sanitizedMessage = String(message).trim();

        if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
            return res.status(400).json({ message: 'All contact fields must contain text.' });
        }

        await db.query(
            `INSERT INTO contacts (name, email, message)
             VALUES (?, ?, ?)`,
            [sanitizedName, sanitizedEmail, sanitizedMessage]
        );

        res.status(201).json({ message: 'Your message was saved successfully.' });
    } catch (error) {
        next(error);
    }
}

async function getContacts(req, res, next) {
    try {
        const [rows] = await db.query(
            `SELECT
                id,
                name,
                email,
                message,
                created_at AS createdAt
             FROM contacts
             ORDER BY created_at DESC, id DESC`
        );

        res.json({ data: rows });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    submitContact,
    getContacts,
};