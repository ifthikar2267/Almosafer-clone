import connectDB from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    let posts;
    if (city) {
      posts = await PostModel.find({ city }).limit(5).lean();
    } else {
      posts = await PostModel.find({});
    }

    return Response.json(posts, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ message: error.message }, { status: 500 });
    }
    return Response.json({ message: "Unknown error" }, { status: 500 });
  }
}
