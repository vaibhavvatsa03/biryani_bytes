const { Router } = require('express');
const { Channel, User, Product } = require('../db');
const mongoose = require('mongoose');
const router = Router();

router.get('/discover',async (req,res)=>{
    const channels = await Channel.find();
    res.send(channels);
})

router.put('/:channel',async(req,res)=>{
    const user = await User.findOne({
        "username" : req.headers.username 
    })
    const channel = await Channel.findOne({
        "title" : req.params.channel
    })
    
    if(! channel){
        return res.status(404).send("Channel not found");
    }

    user.channels_joined.push(channel._id);
    await user.save();
    res.send('Channel joined successfully')
})

router.get('/channels',async (req,res)=>{
    const user = User.findOne({
        "username" : req.headers.username
    })
    res.send(user.channels_joined);
})

router.get('/:channel/products',async (req,res)=>{
    const channel = await Channel.findOne({
        "title" : req.params.channel
    })
    if(! channel){
        return res.status(404).send("Channel doesn't exist");
    }
    const objectIdArray = channel.products;
    const objectIdInstances = objectIdArray.map(id => new mongoose.Types.ObjectId(id));
    const products = await Product.find({ _id: { $in: objectIdInstances } });
    res.send(products);
})

module.exports = router;