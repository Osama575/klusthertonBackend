require('dotenv').config()
require('express-async-errors')
require('./oauth2Client')
//something
const { StreamChat } = require('stream-chat')

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter =  require('express-rate-limit');
const passport = require('passport')
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session')

//swagger ui design
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');



const express = require('express')
const app = express()
const connectDB = require('./db/connectdb')

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

const chatClient = new StreamChat(apiKey, apiSecret, { allowServerSideConnect: true });

const authenticateUser = require('./middleware/authenticateUser')



//routers
const auth = require('./routes/auth')
const user = require('./routes/user')
const scoring = require('./routes/scoring')



//errorhandlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(cors({ origin: '*' }))
app.use(helmet());
app.use(passport.initialize())
app.use(xss());
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));


//home route

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));      
app.get('/', (req, res) => {
  res.send('<h1>Ravetech Api is live</h1><a href="/api-docs">API Documentation</a>');
})



//routes
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', user)
app.use('/api/v1/scoring', scoring)






app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 3000

const start = async () => {
    try {
          await connectDB(process.env.MONGO_URL)
          app.listen(port, () => console.log(`server is listening on ${port}...`))
    } catch (error) {
      console.log(error)  
    }
}

start()


//module.exports.handler =  serverless(app)
