"use server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file');
        
        // Basic validation
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "No file provided or invalid file" },
                { status: 400 }
            );
        }
        
        const response = await fetch("https://tintern-server.fly.dev/api/v1/users/resume", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            const responseText = await response.text();
            console.error("Upload failed with status:", response.status, responseText);
            let errorMessage = "Failed to upload resume";
            
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If JSON parsing fails, use the text as is
                errorMessage = responseText || errorMessage;
            }
            
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            message: "Resume uploaded successfully",
            ...data
        });
    } catch (error) {
        console.error("Resume upload error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to upload resume" },
            { status: 500 }
        );
    }
}