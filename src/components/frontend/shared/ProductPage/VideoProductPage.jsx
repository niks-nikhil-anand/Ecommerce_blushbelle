import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const VideoPage = () => {
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const urlPath = window.location.pathname;
    const extractedId = urlPath.substring(urlPath.lastIndexOf("/") + 1);
    setId(extractedId);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/dashboard/video/product/${id}`);
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        setVideoData(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin w-10 h-10 mr-2" />
        Loading video...
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!videoData || videoData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-10 px-4">
      <div
        className="flex overflow-x-auto gap-6 w-full pb-6 container mx-auto px-4 py-8"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {videoData.map((item) => (
          <div
            key={item._id}
            className="flex-shrink-0 w-[15rem] h-[30rem] relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
            onClick={() => setActiveVideo(item.video)}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute bottom-4 left-4 text-white z-10 bg-black/50 p-2 rounded-md w-[90%]">
              <p className="text-xs opacity-75">{item.views} views</p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Fullscreen-like Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative w-[400px] h-[700px] bg-black rounded-2xl overflow-hidden shadow-lg">
            <button
              className="absolute top-2 right-2 z-10 text-white bg-black/60 p-1 rounded-full"
              onClick={() => setActiveVideo(null)}
            >
              ✕
            </button>
            <video
              src={activeVideo}
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
