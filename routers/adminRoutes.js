const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminControllers')
router.get('/',adminController.getadmin)
router.post('/signin',adminController.login)
router.get('/getdashboard',adminController.getDashboard);
router.get('/getrecipes',adminController.getRecipes)
router.post('/addRecipe',adminController.addRecipe)
router.get('/getDisease',adminController.getDisease)
router.post('/addDisease',adminController.addDisease)
router.get('/getView',adminController.getView)
module.exports = router