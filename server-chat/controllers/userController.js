const User = require("../models/user");
const filterObj = require("../utils/filterObj");
const FriendRequest = require("../models/friendRequest");

exports.updateMe = async (req, res, next) => {

  const {user} = req;
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "about",
    "avatarUrl"
  );

  const userDoc = await User.findByIdAndUpdate(user._id,filteredBody,{
    new:true,
    validateModifiedOnly:true,
  });
  

  res.status(200).json({
    status: "success",
    message: "User Updated successfully",
  });
};


exports.getUsers = async (req, res, next) => {
  const all_users = await User.find({
    verified: true,
  }).select("firstName lastName _id");

  const all_requests = await FriendRequest.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  });

  const this_user = req.user;

  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );



  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
};

exports.getRequests = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const requests = await FriendRequest.find({ sender: req.user._id })
    .populate("sender")
    .select("_id firstName lastName");
  console.log("Fetch requests",requests);
  res.status(200).json({
    status: "success",
    data: requests,
    message: "Requests found successfully!",
  });
};

exports.getFriends = async (req, res, next) => {
  const this_user = await User.findById(req.user._id).populate(
    "friends",
    "_id firstName lastName"
  );
  res.status(200).json({
    status: "success",
    data: this_user.friends,
    message: "Friends found successfully!",
  });
};