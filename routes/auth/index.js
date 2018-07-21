const express = require('express')
const router = express.Router()
const User = require('../../models/login')
const passport = require('../../passport')

/* router.get('/google', passport.authenticate('google', { scope: ['profile'] }))
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
); */

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
	console.log('===== user!!======')
	console.log(req.user)
	if (req.user) {
		return res.json({ user: req.user })
	} else {
		return res.json({ user: null })
	}
});

router.post(
	'/login',
	function(req, res, next) {
		console.log(req.body)
		console.log('================')
		next();
	},
	passport.authenticate('local'),
	(req, res) => {
		console.log('POST to /login')
        const user = JSON.parse(JSON.stringify(req.user)) // hack
        console.log("*****************"+req.message);
        const cleanUser = Object.assign({}, user);        
		if (cleanUser) {
			console.log(`Deleting ${cleanUser.password}`)
			delete cleanUser.password
		}
		res.json({ user: cleanUser })
	}
)

router.post('/logout', (req, res) => {
	if (req.user) {
		req.session.destroy()
		res.clearCookie('connect.sid') // clean up!
		return res.json({ msg: 'logging you out' })
	} else {
		return res.json({ msg: 'no user to log out!' })
	}
})

router.post('/signup', (req, res) => {
	const { firstName,lastName,email, password,restaurantOwner } = req.body
	// ADD VALIDATION
	User.findOne({ 'email': email }).then(function (user) {
		if (user) {
			return res.json({
				error: `Sorry, already there is a user with the email: ${email}`
			})
		}
		else{
			const newUser = new User({
            	'firstName':firstName,
            	'lastName':lastName,
				'email': email,
            	'password': password,
            	'restaurantOwner':restaurantOwner
			})
			newUser.save((err, savedUser) => {
				if (err) return res.json(err)
				return res.json(savedUser)
			})
		}
	})
})

module.exports = router
