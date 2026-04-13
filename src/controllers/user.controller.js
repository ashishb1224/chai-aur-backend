import { asynchandler } from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asynchandler(async (req, res) => {
       // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, password, username} = req.body
    console.log("email: ",email);
    
    if (
        [fullName, email, password, username].some((field) =>
        field?.trim() === "")
    ) {
       throw new ApiError(400, "All fields are required") 
    }
    const existedUser = User.findOne({
        $or: [{email}, {username}],
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")

    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createUser = await User.findById(user._id).select('-password -refreshtoken')
    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    res.status(201).json(
        new ApiResponse(200, createUser, "User registered successfully")
    )

} )

export {registerUser}