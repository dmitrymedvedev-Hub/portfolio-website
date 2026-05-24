const db = require('../config/database');

async function getProjects(req, res, next) {
    try {
        const [rows] = await db.query(
            `SELECT
                id,
                title,
                description,
                image_url AS imageUrl,
                demo_link AS demoLink,
                source_link AS sourceLink,
                created_at AS createdAt
             FROM projects
             ORDER BY created_at DESC, id DESC`
        );

        res.json({ data: rows });
    } catch (error) {
        next(error);
    }
}

async function getProjectById(req, res, next) {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId)) {
            return res.status(400).json({ message: 'Project id must be a number.' });
        }

        const [rows] = await db.query(
            `SELECT
                id,
                title,
                description,
                image_url AS imageUrl,
                demo_link AS demoLink,
                source_link AS sourceLink,
                created_at AS createdAt
             FROM projects
             WHERE id = ?
             LIMIT 1`,
            [projectId]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.json({ data: rows[0] });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProjects,
    getProjectById,
};