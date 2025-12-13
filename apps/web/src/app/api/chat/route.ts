import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/app/api/inngest/client";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        userMessage,
        threadId: providedThreadId,
        userId,
        state,
    } = body;
    if (!userId) {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 }
        );
    }

    const content = userMessage?.content;
    if (!userMessage || !content) {
        return NextResponse.json(
            { error: "content is required" },
            { status: 400 }
        );
    }

    const threadId = providedThreadId || randomUUID();
    console.log("--- api call recvd for ---", threadId, " with content: ", content);

    try {
        const eventId = await inngest.send({
            name: "agent/chat.requested",
            data: {
                threadId,
                userId,
                userMessage: {
                    content,
                    state: state || {},
                },
            },
        });
        
        console.log("✅ Inngest event sent successfully:", eventId);
        
        return NextResponse.json({ 
            success: true, 
            threadId,
            eventId 
        });
    } catch (error) {
        console.error("❌ Error sending Inngest event:", error);
        return NextResponse.json(
            { 
                error: "Failed to send event to Inngest",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: "chal rha hai bhai!" });
}
