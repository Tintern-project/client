import { NextRequest, NextResponse } from "next/server";
import config from "../../../../config";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const backendResponse = await fetch(`${config.apiUrl}/api/v1/users/education/${id}`, {
            method: 'PUT',
            headers: request.headers,
            body: JSON.stringify(body)
        });
        return NextResponse.json(await backendResponse.json());
    } catch (error) {
        return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const backendResponse = await fetch(`${config.apiUrl}/api/v1/users/education/${id}`, {
            method: 'DELETE',
            headers: request.headers
        });
        return NextResponse.json(await backendResponse.json());
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
    }
}