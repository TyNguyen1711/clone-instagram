import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;
    const files = req.files;
    console.log("File: ", files)
    // Tìm hoặc tạo conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Xử lý nội dung tin nhắn
    const messageContent = [];

    // Thêm text textMessage nếu có
    if (textMessage) {
      messageContent.push({
        type: "text",
        data: textMessage,
      });
    }

    // Xử lý files upload
    if (files) {
      const uploadPromises = [];

      // Xử lý images
      if (files.images) {
        const imageFiles = Array.isArray(files.images)
          ? files.images
          : [files.images];
        for (const file of imageFiles) {
          const uploadPromise = sharp(file.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toBuffer()
            .then((optimizedImageBuffer) => {
              const fileUri = `data:${
                file.mimetype
              };base64,${optimizedImageBuffer.toString("base64")}`;
              return cloudinary.uploader.upload(fileUri, {
                folder: "messages/images",
              });
            })
            .then((result) => ({
              type: "image",
              data: result.secure_url,
            }));
          uploadPromises.push(uploadPromise);
        }
      }

      // Xử lý videos
      if (files.videos) {
        const videoFiles = Array.isArray(files.videos)
          ? files.videos
          : [files.videos];
        for (const file of videoFiles) {
          const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "messages/videos",
                resource_type: "video",
              },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    type: "video",
                    data: result.secure_url,
                  });
              }
            );
            uploadStream.end(file.buffer);
          });
          uploadPromises.push(uploadPromise);
        }
      }

      // Xử lý audio
      if (files.audio) {
        const audioFile = files.audio[0]; // Lấy file đầu tiên
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "messages/audio",
              resource_type: "video", // Cloudinary uses 'video' type for audio
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  type: "audio",
                  data: result.secure_url,
                });
            }
          );
          uploadStream.end(audioFile.buffer);
        });
        uploadPromises.push(uploadPromise);
      }

      const uploadedContent = await Promise.all(uploadPromises);
      messageContent.push(...uploadedContent);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      content: messageContent,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation?.messages,
    });
  } catch (error) {
    throw error;
  }
};
