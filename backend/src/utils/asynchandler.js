// using Promises 
const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))

    }
}

// using Async/await
/*
const syncHandler = (fn) => async (req,res,next)=>{
    try {
        
    } catch (error) {
        res.status(error.code || 500).json({
            success:false ,
            message:error.message
        })
    }
} 
*/

export {asyncHandler}