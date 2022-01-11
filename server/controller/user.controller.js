const db = require('../db')

class UserController{
    async createUser(req, res) {
        const {surname, firstname, patronymic, dateOfBirth, gender, registration, phone, email} = req.body     
        const newCustomer = await db.query(`INSERT INTO customer (surname, firstname, patronymic, dateOfBirth, gender, registration, phone, email) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [surname, firstname, patronymic, dateOfBirth, gender, registration, phone, email])
        res.json(newCustomer.rows[0])
    }
    async getUsers(req, res) {
        const users = await db.query('SELECT * FROM customer')
        res.json(users.rows)
    }
    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query('SELECT * FROM customer where id = $1', [id])
        res.json(user.rows[0])  
    }
    async updateUser(req, res) {
        const {id, surname, firstname, patronymic, dateOfBirth, gender, registration, phone, email} = req.body
        const user = await db.query(
            `UPDATE customer set surname = $2, firstname = $3, patronymic = $4, dateOfBirth = $5, gender = $6, registration = $7, phone = $8, email = $9 where id = $1 RETURNING *`,
            [id, surname, firstname, patronymic, dateOfBirth, gender, registration, phone, email]
        )
        res.json(user.rows[0])
    }
    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query('DELETE FROM customer where id = $1', [id])
        res.json(user.rows[0])  
    }
}

module.exports = new UserController()