require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const redirectRoute = require('./routes/redirect')
const shortenRoute = require('./routes/shorten')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

app.use('/', redirectRoute)
app.use('/api/url', shortenRoute)

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
app.listen(PORT, () => console.log(`server is started at post ${PORT}`))
