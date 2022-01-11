const db = require('../db')

class CategoryController {
    async getCategory(req, res) {
        const category = await db.query('SELECT * FROM category')
        res.json(category.rows)
    }
}


module.exports = new CategoryController()