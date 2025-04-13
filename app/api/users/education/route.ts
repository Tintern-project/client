import { NextRequest, NextResponse } from "next/server";

// EDUCATION ENDPOINTS
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
            `http://localhost:3000/api/v1/users/education`,
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
                { error: data.message || "Failed to create education entry" },
                { status: response.status },
            );
        }

        return NextResponse.json(data, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Education creation error:", error);
        return NextResponse.json(
            { error: "Failed to create education entry" },
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
            `http://localhost:3000/api/v1/users/education`,
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
                { error: data.message || "Failed to fetch education" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Education fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch education" },
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
            `http://localhost:3000/api/v1/users/education`,
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
                { error: data.message || "Failed to update education" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Education update error:", error);
        return NextResponse.json(
            { error: "Failed to update education" },
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
            `http://localhost:3000/api/v1/users/education`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body), // Usually need an ID to delete specific education entry
            },
        );
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to delete education" },
                { status: response.status },
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Education delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete education" },
            { status: 500 },
        );
    }
}