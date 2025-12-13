import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { userId, title } = body;

	if (!userId) {
		return NextResponse.json(
			{ error: "userId is required" },
			{ status: 400 }
		);
	}

	const threadId = crypto.randomUUID();
	
	return NextResponse.json({
		threadId,
		title: title || "New Thread",
		createdAt: new Date().toISOString(),
	});
}
