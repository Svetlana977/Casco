const Router = require('express')
const router = new Router()
const passportController = require('../controller/passport.controller')

router.post('/passport', passportController.createPassport)
router.get('/passport', passportController.getPassportsByUser)
router.put('/passport', passportController.updatePassport)


module.exports = router