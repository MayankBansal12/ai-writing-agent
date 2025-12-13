import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { threadId, userId } = body;

	if (!threadId || !userId) {
		return NextResponse.json(
			{ error: "threadId and userId are required" },
			{ status: 400 }
		);
	}

	return NextResponse.json({ success: true });
}
