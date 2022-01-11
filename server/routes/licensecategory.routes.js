const Router = require('express')
const router = new Router()
const licensecategoryController = require('../controller/licensecategory.controller')

router.post('/licensecategory', licensecategoryController.createLicensecategory)
router.get('/licensecategory', licensecategoryController.getLisensecategory)


module.exports = router