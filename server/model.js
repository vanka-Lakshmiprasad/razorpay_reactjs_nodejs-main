const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        Name:{
            type:String,
            required:true
        }, 
        OrderId:{
            type:String,
            required:true
        },
        PaymentId:{
            type:String,
            required:true
        },
        Email:{
            type:String,
            required:true
        }, 
        Amount:{
            type:Number,
            required:true
        },
        PhoneNumber:{
            type:Number,
            required:true
        }
        
    }
);

module.exports = mongoose.model("ONTARI_VIHARI", UserSchema);


