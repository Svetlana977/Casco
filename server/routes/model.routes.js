const Router = require('express')
const router = new Router()
const modelController = require('../controller/model.controller')

router.post('/model', modelController.createModel)
router.get('/model', modelController.getModels)
router.get('/model/:id', modelController.getModelsByMark)
router.put('/model', modelController.updateModel)
router.delete('/model/:id', modelController.deleteModel)


module.exports = router