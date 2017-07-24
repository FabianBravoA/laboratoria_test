const express = require('express');
const passport = require('passport');

const router = new express.Router();

router.post('/signup', (req, res, next) => {
	return passport.authenticate('local-signup', (err) => {
	    if (err) {
	    	if (err.name === 'MongoError' && err.code === 11000) {
		        return res.status(409).json({
		        	success: false,
		        	message: 'Error trying to save this new user',
		        	errors: {
		            	email: 'This email is already taken'
		        	}
		        });
	      	}

	      	return res.status(400).json({
	        	success: false,
	        	message: 'Error trying to save this new user'
	      	});
	    }

	    return res.status(200).json({
	    	sucess : true,
	    	message : "Registered to laboratoria facebook"
	    });
	})(req, res, next);
});

router.post('/signin', (req, res, next) => {
  	return passport.authenticate('local-login', (err, token, userData) => {
    	if (err) {
      		if (err.name === 'IncorrectCredentialsError') {
        		return res.status(400).json({
          		success: false,
          		message: err.message
        	});
      	}

    	return res.status(400).json({
        	success: false,
        	message: 'Login error'
      	});
    }


    return res.json({
      success : true,
      message : 'You have successfully logged in!',
      token : token,
      user: userData
    });
  })(req, res, next);
});

module.exports = router;