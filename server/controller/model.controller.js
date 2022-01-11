const db = require('../db')

class ModelController{
    async createModel(req, res) {
        const {namemodel, id_mark, coefmodel} = req.body     
        const newModel = await db.query(`INSERT INTO model (namemodel, id_mark, coefmodel) values ($1, $2, $3) RETURNING *`, [namemodel, id_mark, coefmodel])
        res.json(newModel.rows[0])
    }
    async getModels(req, res) {
        const models = await db.query('SELECT * FROM model')
        res.json(models.rows)
    }
    async getModelsByMark(req, res) {
        const id = req.params.id
        const models = await db.query('SELECT * FROM model where id_mark = $1', [id])
        res.json(models.rows)
    }
    async updateModel(req, res) {
        const {id, namemodel, id_mark, coefmodel} = req.body
        const model = await db.query(
            `UPDATE model set namemodel = $2, id_mark = $3, coefmodel = $4 where id = $1 RETURNING *`,
            [id, namemodel, id_mark, coefmodel]
        )
        res.json(model.rows[0])
    }
    async deleteModel(req, res) {
        const id = req.params.id
        const model = await db.query('DELETE FROM model where id = $1', [id])
        res.json(model.rows[0])  
    }
}

module.exports = new ModelController()