import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { defaultAvatar, userRoles } from "../constants.js";
import { generatePassword } from "../utils/generatePassword.js";

const registerUser = asyncHandler(async (req, res) => {
  // Steps :
  // get user details from frontend
  // validation  -- empty , email validation ,
  // check if user already not exist via email , identityNumber
  // check for  avatar
  // upload them to cloudinary
  // create user object ,
  // generate random password
  // send password to users email """NOT COMPLETED YET"""
  // check for user creation
  // only send necessary fields to frontend

  const { fullName, email, identityNumber, role , department } = req.body;
  console.log(req.body);
  // Validating every field must be available
  if (!fullName || !email || !identityNumber || !role) {
    throw new ApiError(400, "All fields are required");
  }
  // Another way to validate all fields are having data :
  if (
    [fullName, email, identityNumber, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    //  ".some" : return true if any element of an array fulfilled the provided condition
    throw new ApiError(400, "All fields are required");
  }
  //   checking roles
  if (!userRoles.some((option) => option === role?.toLowerCase()?.trim())) {
    throw new ApiError(400, "Provided Role is not valid");
  }


  // checking is identityNumber or email taken
  const isUserExisted = await User.findOne({
    $or: [{ identityNumber }, { email }],
  });

  if (isUserExisted) {
    throw new ApiError(
      409,
      "User with email and Identity Number already exists"
    );
  }

  // ------------------------------------------------------------------------------
  // Todo: write validations such as email contain @ ,etc
  // ------------------------------------------------------------------------------

  let avatar = defaultAvatar;
  if (req?.files?.avatar && req?.files?.avatar[0]?.path) {
    // files coming from multer middleware
    // extracting file location
    const avatarLocalPath = req.files.avatar[0].path;
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }

  // generate random password for user because user only created by admin panel
  let randomPass = generatePassword();
  console.log(randomPass);
  

  if (!randomPass) {
    throw new ApiError(503, "Password not generating!");
  }

  // ------------------------------------------------------------------------------
  // Todo: Send generated password to user email so user can access his account , place it after successfully user save in db
  // ------------------------------------------------------------------------------

  // alternative while not sending passwords to users email , save fixed password for every user
  randomPass = process.env.TESTING_PASSWORD;



  let data = {
    fullName,
    avatar: avatar.url,
    role,
    identityNumber, 
    email,
    password: randomPass,
  }

 // 
   if (role === 'department') {
      if (!department) {
        return res.status(400).json({ error: 'departmentName is required for department staff.' });
      }
      data.department = department;
    }

  // create user
  const user = await User.create(data);

  // check is user created successfully
  const isUserCreated = await User.findById(user._id)?.select("-password ");

  if (!isUserCreated) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // sending response to frontend

  return res
    .status(201)
    .json(new ApiResponse(201, isUserCreated, "User registered successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // identityNumber or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, identityNumber, password } = req.body;
  console.log(email);

  if (!identityNumber || !email) {
    throw new ApiError(400, "identityNumber or email is required");
  }

  const user = await User.findOne({
    $or: [{ identityNumber }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password ");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged In Successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, fullName, role, identityNumber } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    throw new ApiError(400, "Page and limit must be positive integers.");
  }

  // 2. Build dynamic filter
  const filters = {};

  if (fullName) {
    filters.fullName = { $regex: new RegExp(fullName, "i") }; // case-insensitive partial
  }

  if (identityNumber) {
    filters.identityNumber = { $regex: new RegExp(identityNumber, "i") };
  }

  if (role) {
    filters.role = role;
  }

  // 3. Fetch paginated, filtered users
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find(filters).skip(skip).limit(limit).lean(),
    User.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);
  const result = {
    currentPage: page,
    totalPages,
    usersPerPage: limit,
    totalUsers,
    users,
  };

  // 4. Return response
  res
    .status(200)
    .json(new ApiResponse(200, result, "users according to filters"));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params._id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

export {
  registerUser,
  loginUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getAllUsers,
  getUser,
};
