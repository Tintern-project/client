import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    console.log("[PUT Experience] Starting request handling");
    try {
        const { id } = params;
        console.log("[PUT Experience] Received ID:", id);

        const body = await request.json();
        console.log("[PUT Experience] Request body:", JSON.stringify(body, null, 2));

        console.log("[PUT Experience] Forwarding to backend:", `http://localhost:3000/api/v1/users/experience/${id}`);
        const backendResponse = await fetch(`http://localhost:3000/api/v1/users/experience/${id}`, {
            method: 'PUT',
            headers: request.headers,
            body: JSON.stringify(body)
        });

        console.log("[PUT Experience] Backend response status:", backendResponse.status);
        const responseData = await backendResponse.json();
        console.log("[PUT Experience] Backend response data:", responseData);

        if (!backendResponse.ok) {
            console.error("[PUT Experience] Backend error:", responseData);
            return NextResponse.json(responseData, { status: backendResponse.status });
        }

        console.log("[PUT Experience] Successfully processed request");
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[PUT Experience] Error processing request:", error);
        if (error instanceof Error) {
            console.error("[PUT Experience] Error stack:", error.stack);
        }
        return NextResponse.json({
            error: "Failed to update experience",
            internalError: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    console.log("[DELETE Experience] Starting request handling");
    try {
        const { id } = params;
        console.log("[DELETE Experience] Received ID:", id);

        console.log("[DELETE Experience] Forwarding to backend:", `http://localhost:3000/api/v1/users/experience/${id}`);
        const backendResponse = await fetch(`http://localhost:3000/api/v1/users/experience/${id}`, {
            method: 'DELETE',
            headers: request.headers
        });

        console.log("[DELETE Experience] Backend response status:", backendResponse.status);
        const responseData = await backendResponse.json();
        console.log("[DELETE Experience] Backend response data:", responseData);

        if (!backendResponse.ok) {
            console.error("[DELETE Experience] Backend error:", responseData);
            return NextResponse.json(responseData, { status: backendResponse.status });
        }

        console.log("[DELETE Experience] Successfully processed request");
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("[DELETE Experience] Error processing request:", error);
        if (error instanceof Error) {
            console.error("[DELETE Experience] Error stack:", error.stack);
        }
        return NextResponse.json({
            error: "Failed to delete experience",
            internalError: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}