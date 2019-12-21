const express = require('express')
const router = express.Router()
const Url = require('../models/Url')
const shortid = require('shortid')

router.use(express.json())

router.post('/shorten', async (req, res) => {
	const { longUrl } = req.body

	try {
		let url = await Url.findOne({ longUrl })
		if (url) {
			res.json({ url, message: 'URL has already been shortened!' })
		} else {
			const urlCode = shortid.generate()
			const shortUrl = `${process.env.HOST}/${urlCode}`
			url = new Url({
				longUrl,
				shortUrl,
				urlCode,
				date: new Date()
			})
			await url.save()
			res.json({ url, message: 'Shortened!' })
		}
	} catch (err) {
		console.log(err)
		res.status(500).json(`Sever Error: ${err}`)
	}
})

module.exports = router
