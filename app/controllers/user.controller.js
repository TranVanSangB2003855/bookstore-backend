const USER = require("../models/user.model");
const CART = require("../models/cart.model");
const ORDER = require("../models/order.model");
const BOOK = require("../models/book.model");

exports.getInfoUser = async (req, res) => {
    let user = await USER.findById(req.userId).populate("roles");
    let cartU = await CART.findById(user.cart);
    let authorities = []
    
    for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    let orderPupolate = [];

    let orderT = user.orders;
    const lengthOrder = orderT.length;

    for (let i = 0; i < lengthOrder; i++) {
        let order = await ORDER.findById(orderT[i]);
        let orderProducts = [];
        const lengthProducts = order.products.length;
        for (let i = 0; i < lengthProducts; i++) {
            
            let tempt = await BOOK.findById(order.products[i].book_id, {
                title: 1
            })
            
            orderProducts.push({
                book_id: order.products[i].book_id,
                quantity: order.products[i].quantity,
                price: order.products[i].price,
                title: tempt.title
            })
        }

        orderPupolate.push({
            _id: order._id,
            status: order.status,
            time: order.time,
            address: order.address,
            totalPrice: order.totalPrice,
            products: orderProducts
        })
    }
    res.status(200).send({
        id: user._id,
        phone: user.phone,
        full_name: user.full_name,
        address: user.address,
        orders: orderPupolate,
        cart: cartU,
        roles: authorities,
        accessToken: req.session.token
    });
};

exports.updateInfoUser = async (req, res, next) => {
    try {
        let user = await USER.findById(req.params.id);
        console.log(req.params.id, req.body)
        await user.updateOne({ full_name: req.body.full_name });
        await user.updateOne({ address: req.body.address });
        return res.send({ message: "Updated successfully" });
    } catch (error) {
        console.log(error)
    }
};

var bcrypt = require("bcryptjs");

exports.changePassword = async (req, res, next) => {
    try {
        let user = await USER.findById(req.params.id);
        console.log(user)
        var passwordIsValid = bcrypt.compareSync(
            req.body.passwordOld,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password (Change Password)!" });
        }
        else {
            await user.updateOne({ password: bcrypt.hashSync(req.body.passwordNew, 8) });
            return res.send({ message: "Updated successfully" });
        }
    } catch (error) {
        console.log(error)
    }
}