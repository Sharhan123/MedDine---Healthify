const express = require('express');
const recipeData = require('../models/recipeSchema');
const userData = require('../models/userSchema')
const bcrypt = require('bcrypt')
const diseaseData = require('../models/diseaseSchema')
module.exports = {
    home: async (req, res) => {
        try {
            let session
            if (req.session.user) {
                session = req.session.user
                console.log(session.username + 'hello............................................');
            }
            const recipes = await recipeData.find({}).limit(4)

            res.render('user/home', { recipes, session })
        } catch (err) {
            console.log(err.message);
        }
    },
    getLogin: async (req, res) => {
        try {
            if (req.session.user) {
                res.redirect('/')
            } else {
                let Perror = ''
                let Eerror = ''
                let gError = ''
                if (req.query.Eerror) {
                    Eerror = req.query.Eerror
                }
                if (req.query.Perror) {
                    Perror = req.query.Perror
                }
                if(req.query.gError){
                    gError = req.query.gError
                }
                res.render('user/login', { Perror, Eerror ,gError})
            }
        } catch (err) {
            console.log(err);
        }
    },
    getRegister: function (req, res) {
        try {
            if (req.session.user) {
                res.redirect('/')
            } else {

                let Eerror = ''
                let Perror = ''
                let Uerror = ''
                let Aerror = ''
                if (req.query.Eerror) {
                    Eerror = req.query.Eerror
                }
                if (req.query.Perror) {
                    Perror = req.query.Perror
                }
                if (req.query.Uerror) {
                    Uerror = req.query.Uerror
                }
                if (req.query.Aerror) {
                    Aerror = req.query.Aerror
                }
                res.render('user/register', { Eerror, Perror, Uerror,Aerror,Terror:'' })
            }

        } catch (err) {
            console.log(err);
        }
    },
    postLogin: async (req, res) => {
        try {
            const { email, pass } = req.body


            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                res.redirect('/getLogin?Eerror=Invalid email format');
            }

            // Validate password minimum length
            const minLength = 4; // Set your desired minimum password length
            if (!pass || pass.length < minLength) {
                res.redirect(`/getLogin?Perror=Password must be at least ${minLength} characters long`);
            }

            const user = await userData.findOne({ email: email })
            if (user) {
                bcrypt.compare(pass, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            const data = {
                                username: user.username,
                                email: user.email,
                                id: user._id
                            }
                            req.session.user = data
                            res.redirect('/')
                        } else {

                            res.redirect('/getLogin?Perror=Invalid password');
                        }
                    })

            } else {
                return res.redirect('/getLogin?Eerror=Invalid email address')
            }


        } catch (err) {
            console.log(err);
        }
    },
    postRegister: async (req, res) => {
        try {
            const { username, email,age,type ,pass, cpass } = req.body;

            if (!username || username.trim() === '') {
                return res.redirect('/getRegister?Uerror=Username is required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                return res.redirect('/getRegister?Eerror=Invalid email format');
            }

            if(age === ''){
                return res.redirect('/getRegister?Aerror=Provide a valid age');
            }

            // Validate password minimum length
            const minLength = 4; // Set your desired minimum password length
            if (!pass || pass.length < minLength) {
                return res.redirect(`/getRegister?Perror=Password must be at least ${minLength} characters long`);
            }



            const exist = await userData.findOne({ email: email })

            if (exist) {
                return res.redirect('/getRegister?Eerror= Email address is already registered')
            } else {
                if (pass === cpass) {
                    const hashedPass = await bcrypt.hash(pass, 10)

                    const saveData = new userData({
                        username: username,
                        email: email,
                        password: hashedPass,
                        age:age,
                        type:type
                    })

                    const sData = await saveData.save()

                    const sessionData = {
                        id: sData._id,
                        username: sData.username,
                        email: sData.email
                    }
                    req.session.user = sessionData
                    return res.redirect('/')
                } else {
                    return res.redirect('/getRegister?Perror=Password and confirm Password does not match')
                }
            }

        } catch (err) {
            console.log(err);
        }
    },
    logout: async (req, res) => {
        try {
            req.session.user = null
            res.redirect('/')
        } catch (err) {
            console.log(err);
        }
    },
    getDisease:async(req,res)=>{
        try{
            if(req.session.user){
                res.render('user/disease')
            }else{
                return res.redirect('/getLogin?Eerror=Please login to get your meal plan !!')
            }
        }catch(err){
            console.log(err);
        }
    },
    searchValues:async(req,res)=>{
        try{
            const value = req.query.query
            const regex = new RegExp(`^${value}`, 'i');
            const data = await diseaseData.find({disease:{$regex:regex}})

            return res.json(data)

        }catch(err){
            console.log(err);
        }
    },
    getDiet:async(req,res)=>{
        try{
            let session = ''
            session = req.session.user
            if(req.query.data){
                const regexPattern = new RegExp(req.query.data, 'i');
                const Data = await diseaseData.findOne({disease:{$regex: regexPattern}})
                res.render('user/dietPlan',{Data,session})
            }else{
                res.redirect('/')
            }
        }catch(err){
            console.log(err);
        }
    },
    postDisease: async (req, res) => {
        try {
          if (req.session.user) {
            let session = req.session.user;
            let value = req.body.query;
            console.log(value);
            const regexPattern = new RegExp(value, 'i');
      
            const Data = await diseaseData.findOne({ disease: { $regex: regexPattern } });

            if (Data) {
                console.log(Data);
              return res.json({Data,session,value})
            } else {
              res.redirect('/disease?error=sorry, currently we dont have the disease you searched for');
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
      getProfile : async (req,res)=>{
        try{
            if(req.session.user){
                const user = await userData.findOne({_id:req.session.user.id})
                res.render('user/profile',{user})
            }else{
                res.redirect('/getLogin?gError=You must have to login to get profile')
            }
        }catch(err){
            console.log(err);
        }
      }
      
    

}