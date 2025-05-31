import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import { Video } from "@/models/videoModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const video = formData.get("video");
    const product = formData.get("product");
    const likes = formData.get("likes");
    const views = formData.get("views");
    const isPublishedOnHomepage = formData.get("isPublishedOnHomepage");

    // Validate required fields
    if (!title || !description || !video) {
      return NextResponse.json({ 
        msg: "Please provide all the required fields (title, description, and video)." 
      }, { status: 400 });
    }

    // Upload the video using the uploadImage function (it can handle videos too)
    const videoUploadResult = await uploadImage(video, "videoUploads");

    if (!videoUploadResult.secure_url) {
      return NextResponse.json({ msg: "Video upload failed." }, { status: 500 });
    }

    const videoUrl = videoUploadResult.secure_url;

    // Parse description if it's a JSON string
    let parsedDescription = description;
    try {
      parsedDescription = JSON.parse(description);
    } catch (error) {
      // If parsing fails, keep it as string
      parsedDescription = description;
    }

    // Prepare video data
    const videoData = {
      title,
      description: parsedDescription,
      video: videoUrl,
      product: product || null, // Optional field
      isPublishedOnHomepage: isPublishedOnHomepage === 'true' || isPublishedOnHomepage === true,
      views,
      likes
    };

    // Save the video data to the database
    const newVideo = await Video.create(videoData);
    
    return NextResponse.json({ 
      msg: "Video uploaded successfully",
      data: newVideo
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json({ 
      msg: "Error uploading video", 
      error: error.message 
    }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isPublished = searchParams.get("isPublished");
    const productId = searchParams.get("product");

    // Build query object
    let query = {};
    
    // Filter by published status if specified
    if (isPublished !== null) {
      query.isPublishedOnHomepage = isPublished === 'true';
    }
    
    // Filter by product if specified
    if (productId) {
      query.product = productId;
    }

    // Fetch videos and populate the 'product' field
    const videos = await Video.find(query)
      .populate("product")
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ 
      msg: "Error fetching videos", 
      error: error.message 
    }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ 
        msg: "Video ID is required" 
      }, { status: 400 });
    }

    const formData = await req.formData();
    
    const title = formData.get("title");
    const description = formData.get("description");
    const video = formData.get("video");
    const product = formData.get("product");
    const isPublishedOnHomepage = formData.get("isPublishedOnHomepage");

    // Find the existing video
    const existingVideo = await Video.findById(videoId);
    if (!existingVideo) {
      return NextResponse.json({ 
        msg: "Video not found" 
      }, { status: 404 });
    }

    // Prepare update data
    const updateData = {};

    if (title) updateData.title = title;
    
    if (description) {
      try {
        updateData.description = JSON.parse(description);
      } catch (error) {
        updateData.description = description;
      }
    }

    if (product !== null) updateData.product = product || null;
    
    if (isPublishedOnHomepage !== null) {
      updateData.isPublishedOnHomepage = isPublishedOnHomepage === 'true' || isPublishedOnHomepage === true;
    }

    // Handle video upload if new video is provided
    if (video) {
      const videoUploadResult = await uploadImage(video, "videoUploads");
      
      if (!videoUploadResult.secure_url) {
        return NextResponse.json({ msg: "Video upload failed." }, { status: 500 });
      }
      
      updateData.video = videoUploadResult.secure_url;
    }

    // Update the video
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId, 
      updateData, 
      { new: true }
    ).populate("product");

    return NextResponse.json({ 
      msg: "Video updated successfully",
      data: updatedVideo
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json({ 
      msg: "Error updating video", 
      error: error.message 
    }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ 
        msg: "Video ID is required" 
      }, { status: 400 });
    }

    // Find and delete the video
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return NextResponse.json({ 
        msg: "Video not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      msg: "Video deleted successfully",
      data: deletedVideo
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ 
      msg: "Error deleting video", 
      error: error.message 
    }, { status: 500 });
  }
};