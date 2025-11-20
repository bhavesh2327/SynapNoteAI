import mongoose from "mongoose";

const noteSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
        default : "Untitled Note"
    },
    content:{
        type: String,
        required: [true , "Please enter note content"]
    },
    summary:{
        type: String,
        default:"",
    },
    keywords:{
        type:[String],
        default:[],
        lowercase: true
    },
    tags:[
        {
            type:String,
            lowerCase: true
        }
    ],
    pinned:{
        type:Boolean,
        default:false
    },
    archived:{
        type:Boolean,
        default:false,
    },
} , {
    timestamps: true
});


const Note = mongoose.model("Note" , noteSchema);

export default Note;