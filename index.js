require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
app.enable('trust proxy')
const redirectRoute = require('./routes/redirect')
const shortenRoute = require('./routes/shorten')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')))
	//app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')))
}

app.use('/', redirectRoute)
app.use('/api/url', shortenRoute)
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

app.listen(PORT, () => console.log(`server is started at port ${PORT}`))
