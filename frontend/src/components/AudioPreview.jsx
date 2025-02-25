import React, { useEffect, useState, useRef } from "react";
import { Play, X } from "lucide-react";

const AudioPreview = ({ audioFile, onRemove, onSend }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Tạo URL cho file audio và đảm bảo cleanup khi component unmount
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);

      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [audioFile]);

  // Set up audio element khi audioUrl thay đổi
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;

      // Khởi tạo metadata khi audio load xong
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        }
      };
    }
  }, [audioUrl]);

  // Set up event listeners cho audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error("Error playing audio:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Thêm Promise để bắt lỗi khi không thể phát
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center w-full gap-2 px-3 py-2 bg-gray-100 rounded-full">
      <audio ref={audioRef} className="hidden" controls />

      <button
        onClick={togglePlay}
        className={`p-3 rounded-full ${
          isPlaying ? "bg-red-500" : "bg-blue-500"
        } text-white flex-shrink-0`}
      >
        {isPlaying ? <X size={16} /> : <Play size={16} />}
      </button>

      <div className="flex-1 relative h-8 bg-white rounded-full overflow-hidden">
        {/* Thanh progress có hiệu ứng transition mượt */}
        <div
          className="absolute h-full bg-blue-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Visualization với hiệu ứng sóng âm */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const isCurrent = (i / 30) * 100 <= progress;
            // Sử dụng các giá trị sin và cosine để tạo hiệu ứng sóng âm
            const height = 8 + Math.sin(i * 0.5 + currentTime) * 8;

            return (
              <div
                key={i}
                className={`w-0.5 ${
                  isCurrent ? "bg-blue-600" : "bg-gray-300"
                } transition-all duration-300`}
                style={{
                  height: `${height}px`,
                  transform: `scaleY(${isCurrent ? 1.2 : 1})`,
                }}
              />
            );
          })}
        </div>

        {/* Hiển thị thời gian với background nửa trong suốt */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4">
          <span className="text-xs text-gray-600 bg-white bg-opacity-70 px-1 rounded shadow-sm">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs text-gray-600 bg-white bg-opacity-70 px-1 rounded shadow-sm">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <button
        onClick={onSend}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
      >
        Send
      </button>

      <button
        onClick={onRemove}
        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default AudioPreview;
