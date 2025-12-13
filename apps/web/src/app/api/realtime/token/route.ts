import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionToken } from "@inngest/realtime";
import { inngest } from "@/app/api/inngest/client";
import { createChannel } from "@/app/api/inngest/realtime";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  console.log("🔑 [Realtime Token] User ID received:", userId);
  
  if (!userId) {
    console.error("❌ [Realtime Token] Error: userId is missing!");
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const channelInstance = createChannel(userId);
  const channelKey = userId; // Channel key is the userId string
  
  console.log("📡 [Realtime Token] Creating subscription token:");
  console.log("   - Channel Key:", channelKey);
  console.log("   - Topics:", ["agent_stream"]);
  
  // TODO: Add authentication/authorization here
  const token = await getSubscriptionToken(inngest, {
    channel: channelInstance,
    topics: ["agent_stream"],
  });
  
  console.log("✅ [Realtime Token] Token generated successfully for channel:", channelKey);
  
  return NextResponse.json(token);
}
