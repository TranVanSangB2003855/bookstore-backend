const CART = require("../models/cart.model");
const ApiError = require("../api-error");

const cartController = {
    updateCart: async (req, res, next) =>{
        try{
            let cart = await CART.findById(req.params.id);
            console.log(req.body)
            await cart.updateOne({ $set: req.body });
            return res.send({ message: " Cart was updated successfully" });
        }catch(error){
            return next(
                new ApiError(500, `An error: ${error} occurred while update Cart`)
            );
        }
    }
}

module.exports = cartController;