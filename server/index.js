const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8080
const userRouter = require('./routes/user.routes')
const passportRouter = require('./routes/passport.routes')
const drivelicenseRouter = require('./routes/drivelicense.routes')
const licensecategoryRouter = require('./routes/licensecategory.routes')
const markRouter = require('./routes/mark.routes')
const modelRouter = require('./routes/model.routes')
const carRouter = require('./routes/car.routes')
const agentRouter = require('./routes/agent.routes')
const policyRouter = require('./routes/policy.routes')
const docRouter = require('./routes/doc.routes')
const categoryRouter = require('./routes/category.routes')

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
      next();
    });
app.use(cors());


app.use(express.json())
app.use('/api', userRouter)
app.use('/api', passportRouter)
app.use('/api', drivelicenseRouter)
app.use('/api', licensecategoryRouter)
app.use('/api', markRouter)
app.use('/api', modelRouter)
app.use('/api', carRouter)
app.use('/api', agentRouter)
app.use('/api', policyRouter)
app.use('/api', docRouter)
app.use('/api', categoryRouter)

app.listen(PORT, () => console.log(`server started on port ${PORT}`))