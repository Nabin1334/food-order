import userModel from '../models/userModel.js';


//add to cart
  const addToCart = async (req, res) => {
    try {
let userData = await userModel.findById(req.body.userId);
  let cartData =  await userData.cartData;
  if(!cartData[req.body.itemId]){
cartData[req.body.itemId] = 1
  }
    else{
cartData[req.body.itemId] += 1;
}
await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
        res.json({ success: true, message: 'Item added to cart successfully', cartData });
    }catch (error) {

         Console.log ('Error adding to cart:', error);
        res.json({ success: false, message: 'Failed to add item to cart' });
    }



}
//remove from cart
    const removeFromCart = async (req, res) => {
        try{
            let userData = await userModel.findOne({ _id: req.body.userId });
            let cartData = await userData.cartData;
            if (cartData[req.body.itemId] >0 ){
                cartData[req.body.itemId] -= 1;
            }
            await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
            res.json({ success: true, message: 'Item removed from cart successfully', cartData });
        }
        catch (error) {
            console.log('Error removing from cart:', error);
            res.json({ success: false, message: 'Failed to remove item from cart' });
        }

    }

//fetch user cart data 
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log('Error fetching cart data:', error);
        res.json({ success: false, message: 'Failed to fetch cart data' });
    }

}
export { addToCart, removeFromCart, getCart }