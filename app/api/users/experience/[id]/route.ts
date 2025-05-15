import { NextRequest, NextResponse } from "next/server";
import config from "../../../../config";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const body = await request.json();

        const backendResponse = await fetch(`${config.apiUrl}/api/v1/users/experience/${id}`, {
            method: 'PUT',
            headers: request.headers,
            body: JSON.stringify(body)
        });

        const responseData = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(responseData, { status: backendResponse.status });
        }

        return NextResponse.json(responseData);

    } catch (error) {
        if (error instanceof Error) {
        }
        return NextResponse.json({
            error: "Failed to update experience",
            internalError: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const backendResponse = await fetch(`${config.apiUrl}/api/v1/users/experience/${id}`, {
            method: 'DELETE',
            headers: request.headers
        });

        const responseData = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json(responseData, { status: backendResponse.status });
        }

        return NextResponse.json(responseData);

    } catch (error) {
        return NextResponse.json({
            error: "Failed to delete experience",
            internalError: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}