import React, { useState } from 'react'
import QRCode from 'qrcode.react'
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	RedditShareButton,
	ViberShareButton,
	EmailShareButton,
	FacebookIcon,
	LinkedinIcon,
	TwitterIcon,
	WhatsappIcon,
	RedditIcon,
	ViberIcon,
	EmailIcon
} from 'react-share'

const isValidUri = url => {
	const pattern = new RegExp(
		'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
		'i'
	)
	return !!pattern.test(url)
}

const serverFetch = async value => {
	const api = `/api/url/shorten`
	const config = {
		method: 'POST',
		mode: 'cors',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			longUrl: value
		})
	}
	const resolve = await fetch(api, config)
	const data = await resolve.json()
	return data
}

function App() {
	const [ inputValue, setInputValue ] = useState('')
	const [ validate, setValidate ] = useState('')
	const [ isGenerate, setIsGenerate ] = useState(false)
	const [ response, setResponse ] = useState(null)
	const [ isCopy, setIsCopy ] = useState(false)
	const [ isShare, setIsShare ] = useState(false)
	const [ isQR, setIsQR ] = useState(false)

	const handleChange = e => setInputValue(e.target.value)

	const handleSubmit = async e => {
		e.preventDefault()
		setIsGenerate(true)

		if (!isValidUri(inputValue)) {
			setValidate('Please enter a valid URL!')
			setIsGenerate(false)
			return
		} else {
			setValidate('Shortening...')
			const resolve = await serverFetch(inputValue)
			try {
				setResponse(resolve)
				setInputValue('')
				setIsGenerate(false)
				setValidate('')
			} catch (error) {
				console.error(error)
				setIsGenerate(false)
			}
		}
	}

	const hanldeClear = () => {
		setInputValue('')
		setIsGenerate(false)
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(response.url.shortUrl)
		setIsCopy(true)
		setTimeout(() => setIsCopy(false), 5000)
	}

	const handleShare = () => setIsShare(!isShare)

	return (
		<div className="App d-flex flex-column vh-100 justify-content-between">
			<div className="container">
				<div className="body mx-auto w-75">
					<h1 className="title">Parvos</h1>
					<p className="lead">
						Parvos is Free URL shortener tool to shorten a long URL and reduce its length. Use our URL
						Shortener to create a trusted shortened links and share them with your family and friends.
					</p>
					<form className="form" onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="url" className="text-muted small d-flex justify-content-between mb-0">
								<span>Add URL</span>
								{inputValue.length > 1 && (
									<button className="text-center close" onClick={hanldeClear} title="clear">
										&#x2715;
									</button>
								)}
							</label>
							<input
								type="url"
								name="url"
								className="form-control"
								placeholder="Enter Your Long URL"
								value={inputValue}
								onChange={handleChange}
								autoComplete="url"
								required
								disabled={isGenerate}
							/>
							<span className="bar" />
							{validate.length > 0 && <span className="text-success">{validate}</span>}
						</div>

						<div className="d-flex justify-content-center">
							<button className="btn-mui" type="submit" disabled={isGenerate}>
								<span>Generate!</span>
								{isGenerate && (
									<span
										style={{ display: 'inline-block', margin: '0 25px 0 5px', padding: 0 }}
										className="typing-loader"
									/>
								)}
							</button>
						</div>
					</form>

					{!isGenerate &&
					response && (
						<div className="result-box">
							<div className="result-note">{response.message}</div>
							<div className="result-item">
								<span>
									<strong>Long URL: </strong>
								</span>
								<a href={response.url.longUrl} target="_blank" rel="noopener noreferrer">
									{response.url.longUrl}
								</a>
							</div>
							<hr />
							<div className="result-item">
								<span>
									<strong>Short URL: </strong>
								</span>
								<a href={response.url.shortUrl} target="_blank" rel="noopener noreferrer">
									{response.url.shortUrl}
								</a>
							</div>
							<div className="d-flex result-item mt-2">
								<button title="Copy" onClick={handleCopy} disabled={isCopy} className="result-btn">
									{isCopy ? 'Copied' : 'Copy'}
								</button>

								<button title="Share" className="result-btn" onClick={handleShare}>
									Share
								</button>

								<button title="QR Code" onClick={() => setIsQR(!isQR)} className="result-btn">
									QR Corde
								</button>
							</div>
							{isQR && (
								<div className="mt-1">
									<QRCode value={response.url.shortUrl} />
								</div>
							)}
							{isShare && (
								<div className="d-flex mt-1">
									<FacebookShareButton url={response.url.shortUrl} style={{ cursor: 'pointer' }}>
										<FacebookIcon size={32} round={true} />
									</FacebookShareButton>
									<LinkedinShareButton
										url={response.url.shortUrl}
										style={{ padding: '0 5px', cursor: 'pointer' }}
									>
										<LinkedinIcon size={32} round={true} />
									</LinkedinShareButton>
									<TwitterShareButton
										url={response.url.shortUrl}
										style={{ padding: '0 5px', cursor: 'pointer' }}
									>
										<TwitterIcon size={32} round={true} />
									</TwitterShareButton>
									<WhatsappShareButton
										url={response.url.shortUrl}
										style={{ padding: '0 5px', cursor: 'pointer' }}
										className="d-md-none"
									>
										<WhatsappIcon size={32} round={true} />
									</WhatsappShareButton>
									<RedditShareButton
										url={response.url.shortUrl}
										style={{ padding: '0 5px', cursor: 'pointer' }}
									>
										<RedditIcon size={32} round={true} />
									</RedditShareButton>
									<ViberShareButton
										url={response.url.shortUrl}
										style={{ padding: '0 5px', cursor: 'pointer' }}
										className="d-md-none"
									>
										<ViberIcon size={32} round={true} />
									</ViberShareButton>
									<EmailShareButton url={response.url.shortUrl} style={{ cursor: 'pointer' }}>
										<EmailIcon size={32} round={true} />
									</EmailShareButton>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			<footer className="small text-muted footer mb-2">
				<div className="footer-info text-center">
					<ul className="list-inline">
						<li className="list-inline-item">v1.0.0</li>
						<li className="list-inline-item"> - </li>
						<li className="list-inline-item">
							<a
								href="https://github.com/awran5/parvos/"
								target="_blank"
								title="GitHub"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
						</li>
						<li className="list-inline-item"> - </li>
						<li className="list-inline-item">
							<a
								href="https://github.com/awran5/parvos/issues"
								target="_blank"
								title="Issues"
								rel="noopener noreferrer"
							>
								Issues
							</a>
						</li>
					</ul>
					<div className="copyright">
						© {new Date().getFullYear()}. Designed and built with ❤️ by the
						<a href="https://gkstyle.net/" title="GK STYLE">
							{' '}
							GK STYLE{' '}
						</a>
						team.
					</div>
				</div>
			</footer>
		</div>
	)
}

export default App

console.log('%cHey!', 'color:red;font-family:system-ui;font-size:2rem;font-weight:bold')
console.log(
	'%cLike what you see? Follow me at https://github.com/awran5 or visit us at https://gkstyle.net/',
	'color:blue;font-family:system-ui;font-size:13px'
)
