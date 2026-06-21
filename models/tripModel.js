const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    estimatedCostUSD:{
        type:Number,
        default:0
    },
    timeOfDay:{
        type:String,
        enum:["Morning","Afternoon","Evening"],
        default:"Morning"
    }
},{
    timestamps:true
})

const itineraryDaySchema = new Schema({
    dayNumber:{
        type:Number,
        required:true
    },
    activities: [activitySchema]
},{
    timestamps: true
})

const hotelSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    tier:{
        type:String,
        default:""
    },
    estimatedCostNightUSD:{
        type:Number,
        default:0
    },
    rating:{
        type:String,
        default:""
    }
},{
    _id: false,
})

const packingItemSchema = new Schema({
    item:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["Documents","Clothing","Gear","Other"],
        default:"Other"
    },
    isPacked:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
})

const tripSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    durationDays:{
        type:Number,
        required:true,
        min:1
    },
    budgetTier:{
        type:String,
        enum:["Low","Medium","High"],
        required:true
    },
    interests:[
        {type: String}
    ],

    itinerary:[itineraryDaySchema],

    hotels:[hotelSchema],

    estimatedBudget:{
        transport:{
            type:Number,
            default:0
        },
        accommodation:{
           type:Number,
           default:0 
        },
        food:{
            type:Number,
            default:0
        },
        activities:{
            type:Number,
            default:0
        },
        total:{
            type:Number,
            default:0
        }
    },

    packingList:[packingItemSchema],

    status:{
        type:String,
        enum:["draft","completed"],
        deafult:"completed"
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Trip",tripSchema)