const Router = require('express')
const router = new Router()
const policyController = require('../controller/policy.controller')

router.post('/policy', policyController.createPolicy)
router.get('/policy', policyController.getPolicies)
router.get('/policy/:id', policyController.getPoliciesById)
router.put('/policy', policyController.updatePolicy)


module.exports = router