const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

let User = require('../models/User')

let signupController = require('../controllers/singupController')

let userController = require('../controllers/userController')

/* GET users listing. */
// TODO
router.get('/', function(req, res, next) {
    userController.findAllUsers({}, (err, users) => {
        if (err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        } else {
            res.json({
                confirmation: 'Success',
                payload: users
            })
        }
    })
});

router.post('/register', signupController.checkExistEmail, signupController.checkExistUsername, signupController.createUser)

router.get('/register', (req, res) => {
    res.render('register', { error_msg: false, success_msg: false })
})

//route for '/login'
router.get('/login', (req, res) => {
    res.render('login', {success_msg: false, error_msg: false})
})

router.post('/login', (req, res) => {
    // 1. find user in MongoDB using email
    // 2. use bcrypt.compare to compare password from login form and user.password
    // 3.1 if passwords match render login page with success msg
    // 3.2 if passwords do not match render login page with error msg

    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        }

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    res.status(400).json({
                        confirmation:'failure',
                        message: 'Passwords do not match'
                    })
                }

                if (result) {
                    res.render('login', {success_msg: 'User loggin in', error_msg: false})
                } else {
                    res.render('login', {success_msg: false, error_msg: 'passwords do not match'})
                }
            })
        } else {
            res.status(400).json({
                confirmation: 'failure',
                message: 'There is no such user'
            })
        }
    })

    
    // res.json(req.body)
})

router.put('/updateuserbyid/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser) => {
        if (err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        } else {
            res.json({
                confirmation: 'success',
                payload: updatedUser
            })
        }
    })
})

module.exports = router;