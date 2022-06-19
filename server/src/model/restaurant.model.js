const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name: {type:String, required: true},
        cuisines: {type:String, required: true},
        price: {type:Number, required: true}
    }, 
    { versionKey: false }
)

const RestaurantUpload = mongoose.model("restaurant", restaurantSchema);

module.exports = { RestaurantUpload }