import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const limit = parseInt(searchParams.get("limit") || "20", 10);
	const offset = parseInt(searchParams.get("offset") || "0", 10);
	const userId = searchParams.get("userId");

	if (!userId) {
		return NextResponse.json(
			{ error: "userId is required" },
			{ status: 400 }
		);
	}

	return NextResponse.json({
		threads: [],
		limit,
		offset,
		total: 0,
	});
}

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
