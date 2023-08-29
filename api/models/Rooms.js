import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    maxPeople: {
        type: Number,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    roomNumbers: [{number: Number, unavailableDates: [Date]}],
},
{timestamps:true}
)

export default mongoose.model("Room", roomSchema)