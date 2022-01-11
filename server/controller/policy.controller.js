const db = require('../db')

class PolicyController{
    async createPolicy(req, res) {
        const {numerPolic, dateStart_, dateEnd_, cost, onlyDamage, damageTheft, franchise, sumFranchise, id_car_, id_client_} = req.body     
        const newPolicy = await db.query(`INSERT INTO policyMy (numerPolic, dateStart_, dateEnd_, cost, onlyDamage, damageTheft, franchise, sumFranchise, id_car_, id_client_) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [numerPolic, dateStart_, dateEnd_, cost, onlyDamage, damageTheft, franchise, sumFranchise, id_car_, id_client_])
        res.json(newPolicy.rows[0])
    }
    async getPolicies(req, res) {
        const policies = await db.query('SELECT customer.id, policyMy.numerPolic, policyMy.dateStart_, policyMy.dateEnd_, policyMy.cost, policyMy.onlyDamage, policyMy.damageTheft, policyMy.franchise, policyMy.sumFranchise, policyMy.id_car_, policyMy.id_client_, car.id, car.vin, policyMy.id, customer.surname, customer.firstname FROM policyMy, car, customer WHERE policyMy.id_car_ = car.id and policyMy.id_client_ = customer.id')
        res.json(policies.rows)
    }
    async getPoliciesById(req, res) {
        const id = req.params.id
        const policies = await db.query('SELECT customer.surname, customer.firstname, customer.patronymic, customer.dateOfBirth, customer.gender, customer.registration, customer.phone, customer.email, car.id, car.VIN, car.year, car.id_model_, car.id_mark_, policyMy.numerPolic, policyMy.dateStart_, policyMy.dateEnd_, policyMy.cost, policyMy.onlyDamage, policyMy.franchise, policyMy.sumFranchise, policyMy.id_car_, policyMy.id_client_, mark.id, mark.name_, model.namemodel, model.id, policyMy.id FROM customer, policyMy, car, model, mark where policyMy.id = $1 and policyMy.id_car_=car.id and policyMy.id_client_ = customer.id and car.id_model_ = model.id and car.id_mark_ = mark.id', [id])
        res.json(policies.rows)
    }
    async updatePolicy(req, res) {
        const {id, numerPolic, dateStart_, dateEnd_, cost, onlyDamage, damageTheft, franchise, sumFranchise, id_car_, id_client_} = req.body
        const model = await db.query(
            `UPDATE policyMy set numerPolic = $2, dateStart_ = $3, dateEnd_ = $4, cost = $5, onlyDamage = $6, damageTheft = $7, franchise = $8, sumFranchise = $9, id_car_ = $10, id_client_ = $11 where id = $1 RETURNING *`,
            [id, numerPolic, dateStart_, dateEnd_, cost, onlyDamage, damageTheft, franchise, sumFranchise, id_car_, id_client_]
        )
        res.json(model.rows[0])
    }
}

module.exports = new PolicyController()