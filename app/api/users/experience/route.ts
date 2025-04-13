import { NextRequest, NextResponse } from "next/server";

// EXPERIENCE ENDPOINTS
export async function POST(request: NextRequest) {
    try {
        // 1. Check authentication
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }

        // 2. Parse request body
        const body = await request.json();

        // 3. Forward request to backend
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            },
        );

        // 4. Handle response
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to create experience" },
                { status: response.status },
            );
        }

        return NextResponse.json(data, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Experience creation error:", error);
        return NextResponse.json(
            { error: "Failed to create experience" },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch experience" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Experience fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch experience" },
            { status: 500 },
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        const body = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            },
        );
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to update experience" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Experience update error:", error);
        return NextResponse.json(
            { error: "Failed to update experience" },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        const body = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body), // Usually need an ID to delete specific experience
            },
        );
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to delete experience" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Experience delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete experience" },
            { status: 500 },
        );
    }
}