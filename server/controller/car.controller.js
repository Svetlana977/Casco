const db = require('../db')

class CarController {
    async createCar(req, res) {
        const {VIN, year, id_category_, id_model_, id_mark_, id_customer_} = req.body
        const newCar = await db.query(`INSERT INTO car (VIN, year, id_category_, id_model_, id_mark_, id_customer_) values ($1, $2, $3, $4, $5, $6) RETURNING *`, [VIN, year, id_category_, id_model_, id_mark_, id_customer_])
        res.json(newCar.rows[0])
    }
    async getCars(req, res) {
        const cars = await db.query('SELECT car.id, car.VIN, car.year, car.id_category_, car.id_model_, car.id_mark_, car.id_customer_, mark.name_, mark.coef, model.nameModel, model.coefmodel, customer.surname, customer.firstname, customer.patronymic, customer.dateofbirth, customer.gender, customer.registration, customer.phone, customer.email FROM car, mark, model, customer WHERE car.id_mark_=mark.id and car.id_model_=model.id and car.id_customer_=customer.id')
        res.json(cars.rows)
    }
    async getCarsByUser(req, res) {
        const id = req.params.id
        const cars = await db.query('SELECT c.id as id, c.id_category_ as id_category_, c.id_model_ as id_model_, c.id_mark_ as id_mark, vin, name_,namemodel, year, id_customer_, category FROM car c, mark m, model mo, category cat where c.id_mark_ = m.id and c.id_model_ = mo.id and c.id_category_ = cat.id and id_customer_ = $1', [id])
        res.json(cars.rows)
    }
    async updateCar(req, res) {
        const {id, VIN, year, id_category_, id_model_, id_mark_, id_customer_} = req.body
        const car = await db.query(
            'UPDATE car set VIN = $2, year = $3, id_category_ = $4, id_model_ = $5, id_mark_ = $6, id_customer_ = $7 where id = $1 RETURNING *',
            [id, VIN, year, id_category_, id_model_, id_mark_, id_customer_]
        )
        res.json(car.rows[0])
    }
}


module.exports = new CarController()