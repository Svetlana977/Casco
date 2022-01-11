const db = require('../db')

class PassportController {
    async createPassport(req, res) {
        const {series, number_, dateOfIssue, issued, code, id_customer} = req.body
        const newPassport = await db.query(`INSERT INTO passport (series, number_, dateOfIssue, issued, code, id_customer) values ($1, $2, $3, $4, $5, $6) RETURNING *`, [series, number_, dateOfIssue, issued, code, id_customer])
        res.json(newPassport.rows[0])
    }
    async getPassportsByUser(req, res) {
        const id = req.query.id
        const passports = await db.query('SELECT * from passport where id_customer = $1', [id])
        res.json(passports.rows)
    }
    async updatePassport(req, res) {
        const {id, series, number_, dateOfIssue, issued, code, id_customer} = req.body
        const passport = await db.query(
            'UPDATE passport set series = $2, number_ = $3, dateOfIssue = $4, issued = $5, code = $6, id_customer = $7 where id = $1 RETURNING *',
            [id, series, number_, dateOfIssue, issued, code, id_customer]
        )
        res.json(passport.rows[0])
    }
}


module.exports = new PassportController()