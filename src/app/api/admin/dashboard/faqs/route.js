import connectDB from "@/lib/dbConnect";
import { Faqs } from "@/models/faqsModels";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    await connectDB();

    const { faq, product } = await req.json();

    // Validate required fields
    if (!faq || !Array.isArray(faq) || faq.length === 0) {
      return NextResponse.json(
        { msg: "Please provide FAQ items as a non-empty array." },
        { status: 400 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { msg: "Product association is required." },
        { status: 400 }
      );
    }

    // Validate each FAQ item
    for (let i = 0; i < faq.length; i++) {
      const item = faq[i];
      
      if (!item.question || typeof item.question !== 'string' || !item.question.trim()) {
        return NextResponse.json(
          { msg: `FAQ item ${i + 1} must have a valid question.` },
          { status: 400 }
        );
      }

      if (!item.answer || typeof item.answer !== 'string' || !item.answer.trim()) {
        return NextResponse.json(
          { msg: `FAQ item ${i + 1} must have a valid answer.` },
          { status: 400 }
        );
      }

      // Trim whitespace
      item.question = item.question.trim();
      item.answer = item.answer.trim();
    }

    // Check if FAQ already exists for this product
    const existingFaq = await Faqs.findOne({ product });
    
    if (existingFaq) {
      // Update existing FAQ by adding new items
      existingFaq.faq.push(...faq);
      const updatedFaq = await existingFaq.save();
      
      return NextResponse.json(
        {
          msg: "FAQ items added successfully to existing FAQ",
          data: updatedFaq,
        },
        { status: 200 }
      );
    } else {
      // Create new FAQ document
      const faqData = {
        faq: faq,
        product: product,
      };

      const newFaq = await Faqs.create(faqData);
      
      return NextResponse.json(
        {
          msg: "FAQ created successfully",
          data: newFaq,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("FAQ creation error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          msg: "Validation error",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          msg: "Invalid product ID format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        msg: "Error creating FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    // Build query
    let query = {};
    if (productId) {
      query.product = productId;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Base aggregation pipeline
    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    // Add search functionality if search query is provided
    if (search && search.trim()) {
      pipeline.push({
        $match: {
          $or: [
            { "faq.question": { $regex: search.trim(), $options: "i" } },
            { "faq.answer": { $regex: search.trim(), $options: "i" } },
            { "productDetails.name": { $regex: search.trim(), $options: "i" } }
          ]
        }
      });
    }

    // Add sorting, skip, and limit
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute aggregation
    const faqs = await Faqs.aggregate(pipeline);

    // Get total count for pagination
    let countPipeline = [
      { $match: query },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    if (search && search.trim()) {
      countPipeline.push({
        $match: {
          $or: [
            { "faq.question": { $regex: search.trim(), $options: "i" } },
            { "faq.answer": { $regex: search.trim(), $options: "i" } },
            { "productDetails.name": { $regex: search.trim(), $options: "i" } }
          ]
        }
      });
    }

    countPipeline.push({ $count: "total" });
    const countResult = await Faqs.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json(
      {
        msg: "FAQs fetched successfully",
        data: faqs,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        },
        count: faqs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ fetch error:", error);
    
    return NextResponse.json(
      {
        msg: "Error fetching FAQs",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const faqId = searchParams.get("id");
    
    if (!faqId) {
      return NextResponse.json(
        { msg: "FAQ ID is required for updates." },
        { status: 400 }
      );
    }

    const { faq, product } = await req.json();

    // Validate required fields
    if (!faq || !Array.isArray(faq) || faq.length === 0) {
      return NextResponse.json(
        { msg: "Please provide FAQ items as a non-empty array." },
        { status: 400 }
      );
    }

    // Validate each FAQ item
    for (let i = 0; i < faq.length; i++) {
      const item = faq[i];
      
      if (!item.question || !item.question.trim()) {
        return NextResponse.json(
          { msg: `FAQ item ${i + 1} must have a valid question.` },
          { status: 400 }
        );
      }

      if (!item.answer || !item.answer.trim()) {
        return NextResponse.json(
          { msg: `FAQ item ${i + 1} must have a valid answer.` },
          { status: 400 }
        );
      }

      // Trim whitespace
      item.question = item.question.trim();
      item.answer = item.answer.trim();
    }

    const updateData = { faq };
    if (product) {
      updateData.product = product;
    }

    const updatedFaq = await Faqs.findByIdAndUpdate(
      faqId,
      updateData,
      { new: true, runValidators: true }
    ).populate("product", "name category subCategory");

    if (!updatedFaq) {
      return NextResponse.json(
        { msg: "FAQ not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        msg: "FAQ updated successfully",
        data: updatedFaq,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ update error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          msg: "Validation error",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          msg: "Invalid FAQ ID format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        msg: "Error updating FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const faqId = searchParams.get("id");
    
    if (!faqId) {
      return NextResponse.json(
        { msg: "FAQ ID is required for deletion." },
        { status: 400 }
      );
    }

    const deletedFaq = await Faqs.findByIdAndDelete(faqId);

    if (!deletedFaq) {
      return NextResponse.json(
        { msg: "FAQ not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        msg: "FAQ deleted successfully",
        data: deletedFaq,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ deletion error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        {
          msg: "Invalid FAQ ID format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        msg: "Error deleting FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
};