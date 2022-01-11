const db = require('../db')

class AgentController{
    async createAgent(req, res) {
        const {surname_, firstname_, patronymic_, work, login_, password_} = req.body     
        const newAgent = await db.query(`INSERT INTO agent (surname_, firstname_, patronymic_, work, login_, password_) values ($1, $2, $3, $4, $5, $6) RETURNING *`, [surname_, firstname_, patronymic_, work, login_, password_])
        res.json(newAgent.rows[0])
    }
    async getAgents(req, res) {
        const agents = await db.query('SELECT * FROM agent')
        res.json(agents.rows)
    }
    async getOneAgent(req, res) {
        const id = req.params.id
        const agent = await db.query('SELECT * FROM agent where id = $1', [id])
        res.json(agent.rows[0])  
    }
    async updateAgent(req, res) {
        const {id, surname_, firstname_, patronymic_, work, login_, password_} = req.body
        const agent = await db.query(
            `UPDATE agent set surname_ = $2, firstname_ = $3, patronymic_ = $4, work = $5, login_ = $6, password_ = $7 where id = $1 RETURNING *`,
            [id, surname_, firstname_, patronymic_, work, login_, password_]
        )
        res.json(agent.rows[0])
    }
}

module.exports = new AgentController()