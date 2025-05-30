import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import { Benefit } from "@/models/benefitModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const image = formData.get("image");
    const itemsString = formData.get("items");
    const product = formData.get("product");

    if (!image) {
      return NextResponse.json(
        { msg: "Please provide a featured image." },
        { status: 400 }
      );
    }

    if (!itemsString) {
      return NextResponse.json(
        { msg: "Please provide benefit items." },
        { status: 400 }
      );
    }

    let items = [];
    try {
      items = JSON.parse(itemsString);

      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { msg: "Benefit items must be a non-empty array." },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { msg: "Invalid benefit items format." },
        { status: 400 }
      );
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.title || !item.description) {
        return NextResponse.json(
          { msg: `Benefit item ${i + 1} must have both title and description.` },
          { status: 400 }
        );
      }

      const iconFile = formData.get(`iconFile_${i}`);
      if (iconFile && iconFile.size > 0) {
        try {
          const iconUploadResult = await uploadImage(iconFile, "benefitIcons");
          if (iconUploadResult.secure_url) {
            item.icon = iconUploadResult.secure_url;
          } else {
            return NextResponse.json(
              { msg: `Icon upload failed for benefit item ${i + 1}.` },
              { status: 500 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { msg: `Error uploading icon for benefit item ${i + 1}.` },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            msg: `Icon is required for benefit item ${i + 1}. Please provide an icon image.`,
          },
          { status: 400 }
        );
      }
    }

    const imageUploadResult = await uploadImage(image, "benefitImages");

    if (!imageUploadResult.secure_url) {
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const benefitData = {
      image: imageUploadResult.secure_url,
      items: items,
    };

    if (product && product.trim() !== "") {
      benefitData.product = product;
    }

    if (!benefitData.product) {
      return NextResponse.json(
        { msg: "Product association is required." },
        { status: 400 }
      );
    }

    const newBenefit = await Benefit.create(benefitData);

    return NextResponse.json(
      {
        msg: "Benefit added successfully",
        data: newBenefit,
      },
      { status: 200 }
    );
  } catch (error) {
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

    return NextResponse.json(
      {
        msg: "Error adding benefit",
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

    let query = {};
    if (productId) {
      query.product = productId;
    }

    const benefits = await Benefit.find(query)
      .populate("product", "name category subCategory")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        msg: "Benefits fetched successfully",
        data: benefits,
        count: benefits.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Error fetching benefits",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
