const Router = require('express')
const router = new Router()
const drivelicenseController = require('../controller/drivelicense.controller')

router.post('/drivelicense', drivelicenseController.createDrivelicense)
router.get('/drivelicense', drivelicenseController.getDrivelicensesByUser)
router.put('/drivelicense', drivelicenseController.updateDrivelicense)


module.exports = router