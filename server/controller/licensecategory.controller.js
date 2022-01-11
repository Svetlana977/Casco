const db = require('../db')

class LicensecategoryController {
    async createLicensecategory(req, res) {
        const {id_license, id_category} = req.body
        const newLicensecategory = await db.query(`INSERT INTO licenseCategory (id_license, id_category) values ($1, $2) RETURNING *`, [id_license, id_category])
        res.json(newLicensecategory.rows[0])
    }
    async getLisensecategory(req, res) {
        const licensecategory = await db.query('SELECT * FROM licenseCategory')
        res.json(licensecategory.rows)
    }
}


module.exports = new LicensecategoryController()