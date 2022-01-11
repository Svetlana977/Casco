const Router = require('express')
const router = new Router()
const docController = require('../controller/doc.controller')

router.post('/doc', docController.createDoc)
router.get('/doc', docController.getDocs)
router.get('/doc/:id', docController.getDocsByAgent)


module.exports = router