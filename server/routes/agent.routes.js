const Router = require('express')
const router = new Router()
const agentController = require('../controller/agent.controller')

router.post('/agent', agentController.createAgent)
router.get('/agent', agentController.getAgents)
router.get('/agent/:id', agentController.getOneAgent)
router.put('/agent', agentController.updateAgent)


module.exports = router