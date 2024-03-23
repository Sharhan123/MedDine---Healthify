const mongoose=require('mongoose')

const uschema= new mongoose.Schema(
    {
        username  : {
            type: String,
            required : true

        },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        age : {
            type:Number,
            
        },
        type:{
            type:String,
            
        }   
                
})

module.exports=mongoose.model('user',uschema);

