import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice.js";
import { LuMessageCircleCode } from "react-icons/lu";
import { sendMessageApi } from "@/services/api/message.js";
import { setMessages } from "@/redux/chatSlice";
import Message from "./Message";
import { Smile, X, Plus, Play } from "lucide-react";
import { IconGalary, IconHeart, IconSticker, Microphone } from "./icon";
import AudioPreview from "./AudioPreview.jsx";
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;
const MAX_AUDIO_DURATION = 300;
const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({
    images: [],
    videos: [],
    audio: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    images: [],
    videos: [],
  });
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [showPreviewTray, setShowPreviewTray] = useState(false);
  const fileInputRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  // Function to read file as data URL for preview
  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  // Update preview URLs whenever selected files change
  useEffect(() => {
    const updatePreviews = async () => {
      const imageUrls = await Promise.all(
        selectedFiles.images.map(readFileAsDataURL)
      );

      const videoUrls = selectedFiles.videos.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviewUrls({
        images: imageUrls,
        videos: videoUrls,
      });

      // Show preview tray if there are files to preview
      if (imageUrls.length > 0 || videoUrls.length > 0) {
        setShowPreviewTray(true);
      } else {
        setShowPreviewTray(false);
      }
    };

    updatePreviews();

    // Clean up object URLs on unmount
    return () => {
      previewUrls.videos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const calculateTotalSize = (files) => {
    let size = 0;
    files.images.forEach((file) => (size += file.size));
    files.videos.forEach((file) => (size += file.size));
    if (files.audio) size += files.audio.size;
    return size;
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);

    // If there's audio recording, don't allow file selection
    if (selectedFiles.audio) {
      setError("Please clear audio recording before selecting files");
      event.target.value = null;
      return;
    }

    const images = [];
    const videos = [];
    let newTotalSize = totalSize;

    for (const file of files) {
      newTotalSize += file.size;

      if (newTotalSize > MAX_TOTAL_SIZE) {
        setError("Total file size exceeds 25MB limit");
        break;
      }

      if (file.type.startsWith("image/")) {
        if (selectedFiles.images.length + images.length < 5) {
          images.push(file);
        } else {
          setError("Maximum 5 images allowed");
        }
      } else if (file.type.startsWith("video/")) {
        if (selectedFiles.videos.length + videos.length < 2) {
          videos.push(file);
        } else {
          setError("Maximum 2 videos allowed");
        }
      }
    }

    const newFiles = {
      images: [...selectedFiles.images, ...images].slice(0, 5),
      videos: [...selectedFiles.videos, ...videos].slice(0, 2),
      audio: null,
    };

    const totalFileSize = calculateTotalSize(newFiles);
    if (totalFileSize <= MAX_TOTAL_SIZE) {
      setTotalSize(totalFileSize);
      setSelectedFiles(newFiles);
      setError("");
    }

    // Reset the input value to allow selecting the same file again
    event.target.value = null;
  };

  const removeFile = (type, index) => {
    const newFiles = { ...selectedFiles };
    const newUrls = { ...previewUrls };

    if (type === "image") {
      // Revoke object URL if needed
      newFiles.images.splice(index, 1);
      newUrls.images.splice(index, 1);
    } else if (type === "video") {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(previewUrls.videos[index]);
      newFiles.videos.splice(index, 1);
      newUrls.videos.splice(index, 1);
    }

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    setTotalSize(calculateTotalSize(newFiles));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice-message.webm", {
          type: "audio/webm",
          lastModified: Date.now(),
        });

        setSelectedFiles({
          images: [],
          videos: [],
          audio: audioFile,
        });
        setTotalSize(audioFile.size);
      };

      setMediaRecorder(recorder);
      recorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      setAudioChunks([]);
      setRecordingTime(0);

      // Đảm bảo timer hoạt động đúng
      const timerInterval = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_AUDIO_DURATION - 1) {
            stopRecording();
            return MAX_AUDIO_DURATION;
          }
          return prevTime + 1;
        });
      }, 1000);

      timerIntervalRef.current = timerInterval;
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setAudioChunks([]);
    setRecordingTime(0);
    clearInterval(timerIntervalRef.current);
    setSelectedFiles({
      images: [],
      videos: [],
      audio: null,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }

      // Clean up object URLs
      previewUrls.videos.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaRecorder, previewUrls.videos]);

  const clearSelectedFiles = () => {
    // Revoke all video URLs
    previewUrls.videos.forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles({
      images: [],
      videos: [],
      audio: null,
    });
    setPreviewUrls({
      images: [],
      videos: [],
    });
    setTotalSize(0);
    setError("");
    setShowPreviewTray(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageHandler = async () => {
    try {
      if (!selectedUser?._id) {
        setError("No recipient selected");
        return;
      }

      const formData = new FormData();

      if (selectedFiles.audio) {
        formData.append("audio", selectedFiles.audio);
      } else {
        if (textMessage.trim()) {
          formData.append("textMessage", textMessage);
        }

        selectedFiles.images.forEach((image) => {
          formData.append("images", image);
        });

        selectedFiles.videos.forEach((video) => {
          formData.append("videos", video);
        });
      }

      const response = await sendMessageApi(formData, selectedUser._id);

      if (response.success) {
        dispatch(setMessages([...messages, response.newMessage]));
        setTextMessage("");
        clearSelectedFiles();
        setAudioChunks([]);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  useEffect(() => {
    dispatch(setSelectedUser(null));
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const AudioRecorder = ({ recordingTime, stopRecording, cancelRecording }) => {
    const [progress, setProgress] = useState(0);

    // Hiệu ứng thanh progress chạy từ trái sang phải
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev + 0.5) % 100);
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex items-center w-full gap-2 px-3 py-2 bg-gray-100 rounded-full">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 font-medium">
            Recording... {formatTime(recordingTime)}
          </span>
        </div>

        {/* Thanh progress */}
        <div className="flex-1 h-8 bg-white rounded-full overflow-hidden relative">
          <div
            className="h-full bg-blue-400 absolute top-0 left-0 transition-all duration-500 ease-linear"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-0.5 bg-red-400 opacity-70"
                style={{ height: `${4 + Math.random() * 16}px` }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={stopRecording}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center gap-2"
        >
          <Microphone size={16} />
          Done
        </button>

        <button
          onClick={cancelRecording}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    );
  };
  // Preview component
  const PreviewTray = ({ fileInputRef }) => {
    if (!showPreviewTray) return null;

    return (
      <div className="p-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Media Preview</h3>
          <button onClick={clearSelectedFiles} className="text-red-500 text-sm">
            Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Image previews */}
          {previewUrls.images.map((url, index) => (
            <div key={`img-${index}`} className="relative w-20 h-20">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removeFile("image", index)}
                className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Video previews */}
          {previewUrls.videos.map((url, index) => (
            <div key={`vid-${index}`} className="relative w-20 h-20">
              <div className="w-full h-full rounded bg-black relative overflow-hidden">
                <video src={url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={24} className="text-white opacity-80" />
                </div>
              </div>
              <button
                onClick={() => removeFile("video", index)}
                className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Add more button (only if less than max allowed) */}
          {(selectedFiles.images.length < 5 ||
            selectedFiles.videos.length < 2) && (
            // Thay thế đoạn này trong PreviewTray
            <div
              onClick={() => {
                console.log("123: ", fileInputRef);

                fileInputRef.current?.click();
              }}
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
            >
              <Plus size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Audio preview */}
        {selectedFiles.audio && (
          <AudioPreview
            audioFile={selectedFiles.audio}
            onRemove={clearSelectedFiles}
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen ml-[5%] flex">
      {/* Users List Section */}
      <section className="w-[340px] h-screen flex flex-col border-r border-gray-300">
        <div className="p-4 py-8">
          <h1 className="font-bold text-[20px]">{user?.username}</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {suggestedUsers?.map((suggestedUser, index) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-medium truncate">
                    {suggestedUser?.username}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className="flex-1 h-screen flex flex-col">
          <div className="flex items-center gap-2 border-b border-b-gray-300 py-4 px-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <div>{selectedUser?.username}</div>
              <div className="text-[12px] text-gray-500">
                {onlineUsers.includes(selectedUser?._id)
                  ? "Active now"
                  : "No active"}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedUser && (
              <Message
                selectedUser={selectedUser}
                messagesEndRef={messagesEndRef}
              />
            )}
          </div>

          {/* Error and file size indicator */}
          {error && (
            <div className="px-5 pt-2 text-red-500 text-sm">{error}</div>
          )}
          {totalSize > 0 && (
            <div className="px-5 pt-1 text-gray-500 text-sm">
              Total size: {(totalSize / (1024 * 1024)).toFixed(2)}MB / 25MB
            </div>
          )}

          {/* Preview tray */}
          <PreviewTray fileInputRef={fileInputRef} />

          <div className="p-5">
            <div className="flex items-center gap-2 border border-gray-300 px-4 rounded-[16px]">
              <button className="hover:bg-gray-100 rounded-full">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              {isRecording ? (
                <AudioRecorder
                  recordingTime={recordingTime}
                  stopRecording={stopRecording}
                  cancelRecording={cancelRecording}
                />
              ) : selectedFiles.audio ? (
                <AudioPreview
                  audioFile={selectedFiles.audio}
                  onRemove={clearSelectedFiles}
                  onSend={sendMessageHandler}
                />
              ) : (
                <>
                  {/* UI hiện tại khi không ghi âm */}
                  <input
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    type="text"
                    placeholder="Messages ..."
                    className="flex-1 p-3 border border-gray-200 rounded focus-visible:ring-transparent outline-none border-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && sendMessageHandler()
                    }
                    disabled={selectedFiles.audio !== null}
                  />

                  {textMessage ||
                  selectedFiles.images.length ||
                  selectedFiles.videos.length ||
                  selectedFiles.audio ? (
                    <button
                      onClick={sendMessageHandler}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Send
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button onClick={startRecording}>
                        <Microphone width="1.5rem" height="1.5rem" />
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={selectedFiles.audio !== null}
                      >
                        <IconGalary width="1.5rem" height="1.5rem" />
                      </button>

                      <IconSticker width="1.5rem" height="1.5rem" />
                      <IconHeart width="1.5rem" height="1.5rem" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <LuMessageCircleCode className="w-32 h-32 mb-4" />
          <h1 className="text-xl font-medium">Your messages</h1>
          <span className="text-gray-500">Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
