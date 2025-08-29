import { Schema, model, models } from "mongoose";

// Define schema
const postSchema = new Schema({
  title: { type: String, required: true },
  city: {type: String, required: true},
  country: { type: String, required: true },
  location: { type: String, required: true },
  countryCode: { type: String, required: true },
  star: {type: Number, required: true},
  image: [{ type: String, required: true }],
  price: { type: Number, required: true },
});

// Create model
const PostModel = models.Post || model("Post", postSchema, "post");

export default PostModel;
