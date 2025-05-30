import { NextRequest, NextResponse } from "next/server";

/**
 * Education API Routes
 * These routes handle CRUD operations for user education entries
 */

// Helper function to validate education data
function validateEducationData(data: any) {
    // Required fields
    if (!data.degree || !data.university || !data.startDate || !data.educationLevel) {
        return { valid: false, error: "Missing required fields: degree, university, education level, or start date" };
    }

    // Validate education level
    const validLevels = ['highschool', 'undergrad', 'postgrad', 'phd'];
    if (!validLevels.includes(data.educationLevel)) {
        return { valid: false, error: "Education level must be one of: highschool, undergrad, postgrad, phd" };
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

// Create a new education entry
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
        console.log("POST Education - Request body:", body);

        // Validate education data
        const validation = validateEducationData(body);
        if (!validation.valid) {
            console.error("POST Education - Validation error:", validation.error);
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Forward request to backend
        console.log("POST Education - Sending to backend:", body);
        const response = await fetch(
            `http://localhost:3000/api/v1/users/education`,
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
            console.error("POST Education - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("POST Education - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to create education entry" },
                { status: response.status }
            );
        }

        // Return success response
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("POST Education - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to create education entry" },
            { status: 500 }
        );
    }
}

// Get all education entries for the current user
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
        console.log("GET Education - Fetching from backend");
        const response = await fetch(
            `http://localhost:3000/api/v1/users/education`,
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
            console.error("GET Education - Non-JSON response:", text);
            return NextResponse.json(
                { error: "Invalid response from server" },
                { status: 500 }
            );
        }

        console.log("GET Education - Backend response:", { status: response.status, data });

        // Handle error response
        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Failed to fetch education entries" },
                { status: response.status }
            );
        }

        // Normalize response format
        // If the backend returns an array directly, wrap it in an object
        if (Array.isArray(data)) {
            console.log("GET Education - Converting array to object with educations property");
            data = { educations: data };
        }
        // If the backend doesn't include an educations array, add an empty one
        else if (!data.educations) {
            console.log("GET Education - Adding empty educations array to response");
            data.educations = [];
        }

        // Return success response
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET Education - Unhandled error:", error);
        return NextResponse.json(
            { error: "Failed to fetch education entries" },
            { status: 500 }
        );
    }
}