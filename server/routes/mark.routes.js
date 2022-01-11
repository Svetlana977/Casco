const Router = require('express')
const router = new Router()
const markController = require('../controller/mark.controller')

router.post('/mark', markController.createMark)
router.get('/mark', markController.getMarks)
router.get('/mark/:id', markController.getMark)
router.put('/mark', markController.updateMark)
router.delete('/mark/:id', markController.deleteMark)


module.exports = router