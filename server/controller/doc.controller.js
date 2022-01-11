const db = require('../db')

class DocController {
    async createDoc(req, res) {
        const {numerDoc, date_, id_car, id_client, id_agent} = req.body
        const newDoc = await db.query(`INSERT INTO docRegistr (numerDoc, date_, id_car, id_client, id_agent) values ($1, $2, $3, $4, $5) RETURNING *`, [numerDoc, date_, id_car, id_client, id_agent])
        res.json(newDoc.rows[0])
    }
    async getDocs(req, res) {
        const docs = await db.query('SELECT * FROM docRegistr')
        res.json(docs.rows)
    }
    async getDocsByAgent(req, res) {
        const id = req.params.id
        const docs = await db.query('SELECT c.id, d.numerDoc, d.date_, d.id_car, d.id_client, d.id_agent, car.vin, car.id_customer_, d.id, c.surname, c.firstname FROM docRegistr d, car, customer c where id_agent = $1 and d.id_car = car.id and d.id_client = c.id', [id])
        res.json(docs.rows)
    }
}


module.exports = new DocController()