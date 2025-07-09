import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Beneficiaries } from "../models/beneficiaries.model.js"
import { Token } from '../models/token.model.js'

const createUserAndGenerateToken = asyncHandler(async (req,res)=>{
const {email , fullName, identityNumber , contactNumber , address , purpose , status} = req.body;

  // Validating every field must be available
  if (!fullName || !email || !identityNumber || !contactNumber || !purpose || !department) {
    throw new ApiError(400, "All fields are required");
  }
  // Another way to validate all fields are having data :
  if (
    [email , fullName, identityNumber , contactNumber ,purpose , department].some(
      (field) => field?.trim() === ""
    )
  ) {
    //  ".some" : return true if any element of an array fulfilled the provided condition
    throw new ApiError(400, "All fields are required");
  }

 // checking is identityNumber or email taken
  const isBeneficiaryExisted = await Beneficiaries.findOne({
    $or: [{ identityNumber }, { email }],
  });

  let beneficiaryData;
  if (!isBeneficiaryExisted) {
// registering beneficiary

  const beneficiaryDetail = {
    email,
    fullName,
    identityNumber,
    contactNumber,
    address: address || '',
  }

  // create user
  const beneficiary = await Beneficiaries.create(beneficiaryDetail);

  // check is user created successfully
  const isBeneficiaryCreated = await Beneficiaries.findById(beneficiary._id);

  if (!isBeneficiaryCreated) {
    throw new ApiError(500, "Something went wrong while registering beneficiary");
  }

beneficiaryData = isBeneficiaryCreated;

  }


  beneficiaryData = isBeneficiaryExisted
    const data ={
        department,
        purpose,
        receptionist: req?.user?._id,
        beneficiaries:beneficiaryData?._id,
    }
    // create user
      const token = await Token.create(data);
    
      // check is user created successfully
      const isTokenGenerated = await Token.findById(token._id)?.select("-receptionist -beneficiaries");
    
      if (!isTokenGenerated) {
        throw new ApiError(500, "Something went wrong while generating token");
      }
    
      // sending response to frontend
      const result = {
        detail:beneficiaryData,
        token:isTokenGenerated,
        
      }
    
      return res
        .status(201)
        .json(new ApiResponse(201, result, "Token Generating successfully!"));
  



  // sending response to frontend

//   return res
//     .status(201)
//     .json(new ApiResponse(201, isUserCreated, "User registered successfully!"));

})

// Getting All Beneficiaries
const getAllBeneficiary = asyncHandler(async(req,res)=>{
      let { page = 1, limit = 10, fullName,  identityNumber } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
    
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        throw new ApiError(400, "Page and limit must be positive integers.");
      }
    
      // 2. Build dynamic filter
      let filters = {};
    
      if (fullName) {
        filters.fullName = { $regex: new RegExp(fullName, "i") }; // case-insensitive partial
      }
    
      if (identityNumber) {
        filters.identityNumber = { $regex: new RegExp(identityNumber, "i") };
      }
    
      // 3. Fetch paginated, filtered users
      const skip = (page - 1) * limit;
    
      const [users, totalUsers] = await Promise.all([
        Beneficiaries.find(filters).skip(skip).limit(limit).lean(),
        Beneficiaries.countDocuments(filters),
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
    
})

const getBeneficiary = asyncHandler(async (req, res) => {
  const user = await Beneficiaries.findById(req?.params?.id);
  console.log(user)
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// update beneficiary

const updateBeneficiary = asyncHandler(async (req, res) => {
  const { fullName, email , identityNumber , contactNumber , address} = req.body;

  if (!fullName || !email || !identityNumber || !contactNumber ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await Beneficiaries.findByIdAndUpdate(
    req?.params?.id,
    {
      $set: {
        fullName,
        email: email,
        identityNumber,
        contactNumber,
        address: address || ""
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const deleteBeneficiary = asyncHandler(async (req, res) => {
  const user = await Beneficiaries.findByIdAndDelete(req?.params?.id);
  console.log(user)
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User fetched successfully"));
});

const getAllTokens =asyncHandler(async (req, res)=>{
     let { page = 1, limit = 10, department,  status } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
    
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        throw new ApiError(400, "Page and limit must be positive integers.");
      }
    
      // 2. Build dynamic filter
      let filters = {};
    
      if (department) {
        filters.department = department
      }
      if (status) {
        filters.status = status
      }
    
      // 3. Fetch paginated, filtered users
      const skip = (page - 1) * limit;
    
      const [users, totalUsers] = await Promise.all([
        Token.find(filters).skip(skip).limit(limit).lean(),
        Token.countDocuments(filters),
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
        .json(new ApiResponse(200, result, "Tokens according to filters"));
    

})

export {
    createUserAndGenerateToken,
    getAllBeneficiary,
    getBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getAllTokens
}