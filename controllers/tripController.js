const tripSchema = require("../models/tripModel")

const {generateTravelPlan, regenerateDayPlan} = require("../services/geminiService")

const createTrip = async(req,res) => {
    try{
        const {destination, durationDays, budgetTier, interests} = req.body;

        if( 
            !destination || 
            !durationDays || 
            !budgetTier || 
            !interests || 
            interests.length === 0
        ){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const aiResponse = await generateTravelPlan({
            destination,
            durationDays,
            budgetTier,
            interests
        });

        const Trip = await tripSchema.create({
            userId: req.user._id,
            destination,
            durationDays,
            budgetTier,
            interests,
            itinerary: aiResponse.itinerary,
            hotels: aiResponse.hotels,
            estimatedBudget: aiResponse.estimatedBudget,
            packingList: aiResponse.packingList
        });

        return res.status(201).json({
            message:"Trip Created Successfully",
            Trip
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to create Trip"
        })
    }
}

const getTrips = async(req,res) => {
    try{
        const trips = await tripSchema.find({
            userId: req.user._id
        }).sort({createdAt: -1})

        return res.status(200).json({
            message:"Fetched All trips successfully",
            trips
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to fetch trips"
        })
    }
}

const getTripById = async(req,res) => {
    try{
        const trip = await tripSchema.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if(!trip){
            return res.status(404).json({
                message:"Trip Not Found"
            })
        }

        return res.status(200).json({
            message:"Trip Found Successfully",
            trip
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to fetch trip"
        })
    }
}

const updateTrip = async(req,res) => {
    try{
        const trip = await tripSchema.findOneAndUpdate(
            {
                _id:req.params.id,
                userId: req.user._id
            }, req.body , {new: true}
        )

        if(!trip){
            return res.status(404).json({
                message:"Trip Not Found"
            })
        }

        return res.status(200).json({
            message:"Trip Updated Successfully",
            trip
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to update trip"
        })
    }
}

const deleteTrip = async(req,res) => {
    try{
        const trip = await tripSchema.findOneAndDelete(
            {
                _id:req.params.id,
                userId: req.user._id
            }
        )

        if(!trip){
            return res.status(404).json({
                message:"Trip Not Found"
            })
        }

        return res.status(200).json({
            message:"Trip Deleted Successfully",
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to delete trip"
        })
    }
}

const addActivity = async(req,res) => {
    try{
        const {dayNumber, activity} = req.body;

        const updatedTrip = await tripSchema.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
                "itinerary.dayNumber": Number(dayNumber)
            },
            {
                $push:{
                    "itinerary.$.activities": activity
                }
            },{new: true}
        )

        if(!updatedTrip){
            return res.status(404).json({
                message:"Trip or day Not Found"
            })
        }

        return res.status(200).json({
            message:"Activity added Successfully",
            trip: updatedTrip
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to add activity"
        })
    }
}

const removeActivity = async(req,res) => {
    try{
        const {dayNumber, activityId} = req.body;

        const updatedTrip = await tripSchema.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id,
                "itinerary.dayNumber": Number(dayNumber)
            },
            {
                $pull:{
                    "itinerary.$.activities": {
                        _id: activityId
                    }
                }
            },{new: true}
        )

        if(!updatedTrip){
            return res.status(404).json({
                message:"Trip or activity Not Found"
            })
        }

        return res.status(200).json({
            message:"Activity removed Successfully",
            trip: updatedTrip
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Failed to remove activity"
        })
    }
}

const regenerateDay = async (req, res) => {
  try {
    const { dayNumber, userPrompt } = req.body;

    const trip = await tripSchema.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const regeneratedDay = await regenerateDayPlan({
      destination: trip.destination,
      durationDays: trip.durationDays,
      budgetTier: trip.budgetTier,
      interests: trip.interests,
      dayNumber,
      userPrompt,
    });

    const updatedTrip = await tripSchema.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
        "itinerary.dayNumber": Number(dayNumber),
      },
      {
        $set: {
          "itinerary.$.activities": regeneratedDay.activities,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: `Day ${dayNumber} regenerated successfully`,
      trip: updatedTrip,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to regenerate day",
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivity,
  removeActivity,
  regenerateDay
};