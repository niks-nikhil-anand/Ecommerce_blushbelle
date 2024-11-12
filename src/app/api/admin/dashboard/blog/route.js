export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received.");

    const title = formData.get("title");
    const content = formData.get("content");
    const subtitle = formData.get("subtitle");
    const category = formData.get("category");
    const author = formData.get("author");
    const featuredImage = formData.get("featuredImage");
    const product = formData.get("product");

    console.log("Parsed form data:", { title, content, subtitle, category, author, product });

    // Validate required fields
    if (!title || !content || !subtitle) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Upload the featured image
    const featuredImageResult = await uploadImage(featuredImage, "blogImages");
    console.log("Image upload result:", featuredImageResult);

    if (!featuredImageResult.secure_url) {
      console.error("Image upload failed.");
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const imageUrl = featuredImageResult.secure_url;
    console.log("Image URL:", imageUrl);

    // Convert product to ObjectId
    const mongoose = require('mongoose');
    const productId = mongoose.Types.ObjectId(product);

    // Check if product exists
    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      console.error("Product not found.");
      return NextResponse.json({ msg: "Product not found." }, { status: 400 });
    }

    // Prepare blog data with the product field
    const blogData = {
      title,
      content,
      subtitle,
      category,
      author,
      product: productId, // Add product as ObjectId
      featuredImage: imageUrl,
    };

    console.log("Blog data to be saved:", blogData);

    // Save the blog data to the database
    await Blog.create(blogData);
    console.log("Blog added successfully.");
    return NextResponse.json({ msg: "Blog added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json({ msg: "Error adding blog", error: error.message }, { status: 500 });
  }
};
