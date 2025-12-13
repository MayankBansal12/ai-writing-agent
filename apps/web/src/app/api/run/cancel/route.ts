import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { runId } = body;

	if (!runId) {
		return NextResponse.json(
			{ error: "runId is required" },
			{ status: 400 }
		);
	}

	return NextResponse.json({ success: true });
}
