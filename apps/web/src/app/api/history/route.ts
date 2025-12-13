import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const threadId = searchParams.get("threadId");
	const userId = searchParams.get("userId");

	if (!threadId || !userId) {
		return NextResponse.json(
			{ error: "threadId and userId are required" },
			{ status: 400 }
		);
	}

	return NextResponse.json({
		messages: [],
		threadId,
	});
}
