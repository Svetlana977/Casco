const db = require('../db')

class DrivelicenseController {
    async createDrivelicense(req, res) {
        const {number1, dateStart, dateEnd, nameOfTheDivision, id_customer} = req.body
        const newDrivelicense = await db.query(`INSERT INTO driverLicense (number1, dateStart, dateEnd, nameOfTheDivision, id_customer) values ($1, $2, $3, $4, $5) RETURNING *`, [number1, dateStart, dateEnd, nameOfTheDivision, id_customer])
        res.json(newDrivelicense.rows[0])
    }
    async getDrivelicensesByUser(req, res) {
        const id = req.query.id
        const drivelicenses = await db.query('select * from driverLicense where id_customer = $1', [id])
        res.json(drivelicenses.rows)
    }
    async updateDrivelicense(req, res) {
        const {id, number1, dateStart, dateEnd, nameOfTheDivision, id_customer} = req.body
        const drivelicenses = await db.query(
            'UPDATE driverLicense set number1 = $2, dateStart = $3, dateEnd = $4, nameOfTheDivision = $5, id_customer = $6 where id = $1 RETURNING *',
            [id, number1, dateStart, dateEnd, nameOfTheDivision, id_customer]
        )
        res.json(drivelicenses.rows[0])
    }
}


module.exports = new DrivelicenseController()