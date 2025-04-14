import { NextRequest, NextResponse } from "next/server";

/**
 * Experience API Routes
 * These routes handle CRUD operations for user experience entries
 */

// Helper function to validate experience data
function validateExperienceData(data: any) {
    // Required fields
    if (!data.jobTitle || !data.company || !data.startDate) {
        return { valid: false, error: "Missing required fields: job title, company, or start date" };
    }

    // Validate date formats (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.startDate)) {
        return { valid: false, error: "Start date must be in YYYY-MM-DD format" };
    }

    if (data.endDate && !dateRegex.test(data.endDate)) {
        return { valid: false, error: "End date must be in YYYY-MM-DD format" };
    }

    return { valid: true };
}

// Create a new experience entry
export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        console.log("POST Experience - Request body:", body);

        // Validate experience data
        const validation = validateExperienceData(body);
        if (!validation.valid) {
            console.error("POST Experience - Validation error:", validation.error);
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Forward request to backend
        console.log("POST Experience - Sending to backend:", body);
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        // Parse response data
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("POST Experience - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("POST Experience - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to create experience" },
                { status: response.status }
            );
        }

        // Return success response
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("POST Experience - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to create experience" },
            { status: 500 }
        );
    }
}

// Get all experience entries for the current user
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Forward request to backend
        console.log("GET Experience - Fetching from backend");
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Parse response data
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("GET Experience - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("GET Experience - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch experiences" },
                { status: response.status }
            );
        }

        // Normalize response format
        // If the backend returns an array directly, wrap it in an object
        if (Array.isArray(data)) {
            console.log("GET Experience - Converting array to object with experiences property");
            data = { experiences: data };
        }
        // If the backend doesn't include an experiences array, add an empty one
        else if (!data.experiences) {
            console.log("GET Experience - Adding empty experiences array to response");
            data.experiences = [];
        }

        // Return success response
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET Experience - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to fetch experiences" },
            { status: 500 }
        );
    }
}

// Update an existing experience entry
export async function PUT(request: NextRequest) {
    try {
        // Check authentication
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        console.log("PUT Experience - Request body:", body);

        // Check if ID exists for update
        if (!body.id) {
            return NextResponse.json(
                { error: "ID is required for updating an experience entry" },
                { status: 400 }
            );
        }

        // Validate experience data
        const validation = validateExperienceData(body);
        if (!validation.valid) {
            console.error("PUT Experience - Validation error:", validation.error);
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Forward request to backend
        console.log("PUT Experience - Sending to backend:", body);
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        // Parse response data
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("PUT Experience - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("PUT Experience - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to update experience" },
                { status: response.status }
            );
        }

        // Return success response
        return NextResponse.json(data);
    } catch (error) {
        console.error("PUT Experience - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to update experience" },
            { status: 500 }
        );
    }
}

// Delete an experience entry
export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        console.log("DELETE Experience - Request body:", body);

        // Check if ID exists for deletion
        if (!body.id) {
            return NextResponse.json(
                { error: "ID is required for deleting an experience entry" },
                { status: 400 }
            );
        }

        // Forward request to backend
        console.log("DELETE Experience - Sending to backend:", body);
        const response = await fetch(
            `http://localhost:3000/api/v1/users/experience`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        // Parse response data
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error("DELETE Experience - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("DELETE Experience - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to delete experience" },
                { status: response.status }
            );
        }

        // Return success response
        return NextResponse.json(data);
    } catch (error) {
        console.error("DELETE Experience - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to delete experience" },
            { status: 500 }
        );
    }
}