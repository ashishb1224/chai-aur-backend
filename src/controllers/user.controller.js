import { asynchandler } from '../utils/asynchandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asynchandler(async (req, res) => {
       // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avtar
    // upload them to cloudinary, avtar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

     const { fullName, email, password, username } = req.body;
    console.log("email:", email);
    console.log("BODY:", req.body);

    if ([fullName, email, password, username].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // ✅ correct field usage
    const avtarLocalPath = req.files?.avtar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avtarLocalPath) {
        throw new ApiError(400, "Avtar is required");
    }

    const avtar = await uploadCloudinary(avtarLocalPath);

    const coverImage = coverImageLocalPath
        ? await uploadCloudinary(coverImageLocalPath)
        : null;

    if (!avtar) {
        throw new ApiError(400, "Avtar upload failed");
    }

    const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshtoken");

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
    
});
export {registerUser}