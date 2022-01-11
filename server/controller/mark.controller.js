const db = require('../db')

class MarkController{
    async createMark(req, res) {
        const {name_, coef} = req.body     
        const newMark = await db.query(`INSERT INTO mark (name_, coef) values ($1, $2) RETURNING *`, [name_, coef])
        res.json(newMark.rows[0])
    }
    async getMarks(req, res) {
        const marks = await db.query('SELECT * FROM mark')
        res.json(marks.rows)
    }
    async getMark(req, res) {
        const id = req.params.id
        const mark = await db.query('SELECT name_, coef FROM mark where id = $1', [id])
        res.json(mark.rows)  
    }
    async updateMark(req, res) {
        const {id, name_, coef} = req.body
        const mark = await db.query(
            `UPDATE mark set name_ = $2, coef = $3 where id = $1 RETURNING *`,
            [id, name_, coef]
        )
        res.json(mark.rows[0])
    }
    async deleteMark(req, res) {
        const id = req.params.id
        const mark = await db.query('DELETE FROM mark where id = $1', [id])
        res.json(mark.rows[0])  
    }
}

module.exports = new MarkController()