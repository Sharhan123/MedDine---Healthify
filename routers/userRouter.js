const express = require('express')
const router = express.Router()
const userController  =  require('../controllers/userController');


router.get('/',userController.home);
router.get('/getLogin',userController.getLogin)
router.get('/getRegister',userController.getRegister)
router.post('/register',userController.postRegister)
router.get('/getLogout',userController.logout)
router.post('/login',userController.postLogin)
router.get('/disease',userController.getDisease)
router.get('/search',userController.searchValues)
router.get('/getDiet',userController.getDiet)
router.post('/postDisease',userController.postDisease)
router.get('/profile',userController.getProfile)
module.exports = router;