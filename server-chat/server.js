const app = require("./app");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const http = require("http");
const server = http.createServer(app);
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OneToOneMessage");
const path = require("path");


const { Server } = require("socket.io"); // Add this
const { promisify } = require("util");
const User = require("./models/user");

// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  // console.log(JSON.stringify(socket.handshake.query));
  const user_id = socket.handshake.query["user_id"];

  // console.log(`User connected ${socket.id}`);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, {
      socket_id: socket.id,
      status: "Online",
    });
  }

  // We can write our socket event listeners in here...
  socket.on("friend_request", async (data) => {
    const to = await User.findById(data.sender).select("socket_id");
    const from = await User.findById(data.recipient).select("socket_id");

    // create a friend request
    await FriendRequest.create({
      sender: data.recipient,
      recipient: data.sender,
    });
    // emit event request received to recipient
    io.to(to.socket_id).emit("new_friend_request", {
      message: "New friend request received",
    });
    io.to(from.socket_id).emit("request_sent", {
      message: "Request Sent successfully!",
    });
  });

  socket.on("accept_request", async (data) => {
    // accept friend request => add ref of each other in friends array
    console.log(data);
    const request_doc = await FriendRequest.findById(data.request_id);

    // console.log(request_doc);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);

    // delete this request doc
    // emit event to both of them

    // emit event request accepted to both
    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName _id email status");

    // db.books.find({ authors: { $elemMatch: { name: "John Smith" } } })

    // console.log(existing_conversations);

    callback(existing_conversations);
  });

  socket.on("start_conversation", async (data) => {
    // data: {to: from:}

    const { to, from } = data;

    // check if there is any existing conversation

    const existing_conversations = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversations[0], "Existing Conversation");

    // if no => create a new OneToOneMessage doc & emit event "start_chat" & send conversation details as payload
    if (existing_conversations.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });

      new_chat = await OneToOneMessage.findById(new_chat).populate(
        "participants",
        "firstName lastName _id email status"
      );

      console.log(new_chat);

      socket.emit("start_chat", new_chat);
    }
    // if yes => just emit event "start_chat" & send conversation details as payload
    else {
      socket.emit("start_chat", existing_conversations[0]);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    try {
      const messageDocument = await OneToOneMessage.findById(data.conversation_id).select("messages");
      
      if (!messageDocument) {
        console.log("No message document found for conversation_id:", data.conversation_id);
        callback(null); // Handle the case where the document is not found
        return;
      }
      
      const messages = messageDocument.messages;
      console.log("Fetched messages:", messages);
      callback(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      callback(null); // You might want to handle this case on the client side
    }
  });

  // Handle incoming text/link messages
  socket.on("text_message", async (data) => {
    console.log("Received message:", data);
    const { message, conversation_id, from, to, type } = data;
    console.log("text Data",data);
    return false
    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to: to,
      from: from,
      type: type,
      created_at: Date.now(),
      text: message,
    };

    // fetch OneToOneMessage Doc & push a new message to existing conversation
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    // save to db`
    await chat.save({ new: true, validateModifiedOnly: true });

    // emit incoming_message -> to user

    io.to(to_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    // emit outgoing_message -> from user
    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
  });

  // handle start_audio_call event
  socket.on("start_audio_call", async (data) => {
    const { from, to, roomID } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    // create a new audio call record === log
    await AudioCall.create({
      participants: [from, to],
      from,
      to,
      status: "Ongoing",
    });

    // send notification to receiver of call
    io.to(to_user.socket_id).emit("audio_call_notification", {
      from: from_user,
      roomID,
      streamID: from,
      userID: to,
      userName: to,
    });
  });

  // handle audio_call_not_picked
  socket.on("audio_call_not_picked", async (data) => {
    // find and update call record
    // TODO => emit call_missed to receiver of call
  });

  // handle audio_call_accepted
  socket.on("audio_call_accepted", async (data) => {
    // find and update call record
    // TODO => emit call_accepted to sender of call
  });

  // handle audio_call_denied
  socket.on("audio_call_denied", async (data) => {
    // find and update call record
    // TODO => emit call_denied to sender of call
  });

  // handle user_is_busy_audio_call
  socket.on("user_is_busy_audio_call", async (data) => {
    // find and update call record
    // TODO => emit on_another_audio_call to sender of call
    
  });

  // handle Media/Document Message
  socket.on("file_message", (data) => {
    console.log("Received message:", data);

    // data: {to, from, text, file}

    // Get the file extension
    const fileExtension = path.extname(data.file.name);

    // Generate a unique filename
    const filename = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${fileExtension}`;

    // upload file to AWS s3

    // create a new conversation if its dosent exists yet or add a new message to existing conversation

    // save to db

    // emit incoming_message -> to user

    // emit outgoing_message -> from user
  });

  socket.on("end", async (data) => {
    // Find user by ID and set status as offline

    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, { status: "Offline" });
    }

    // broadcast to all conversation rooms of this user that this user is offline (disconnected)

    console.log("closing connection");
    socket.disconnect(0);
  });
});





const DB = process.env.DBURI

mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB Connection successful");
  }).catch((err) => {
    console.log(err);
  });

  mongoose.set('strictQuery', false);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1); //  Exit Code 1 indicates that a container shut down, either because of an application failure.
  });
});