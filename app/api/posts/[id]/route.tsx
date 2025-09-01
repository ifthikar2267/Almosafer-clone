import { NextResponse, NextRequest } from "next/server";
import dbConnect from "../../../../utils/connectMongo";
import Post from "../../../../models/postModel";

export async function GET(
req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error:"Failed to fetch post" },
      { status: 500 }
    );
  }
}
