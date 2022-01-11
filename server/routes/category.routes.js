const Router = require('express')
const router = new Router()
const categoryController = require('../controller/category.controller')

router.get('/category', categoryController.getCategory)


module.exports = router