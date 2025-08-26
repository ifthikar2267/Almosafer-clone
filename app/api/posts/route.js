import connectDB from "../../../utils/connectMongo";
import PostModel from "../../../models/postModel";

export async function GET() {
    try {
        await connectDB();
        const postData = await PostModel.find({});
        return Response.json(postData);

    } catch (error) {
        return Response.json({message: error.message});
    }
}