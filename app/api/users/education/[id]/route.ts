import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const backendResponse = await fetch(`http://localhost:3000/api/v1/users/education/${id}`, {
            method: 'PUT',
            headers: request.headers,
            body: JSON.stringify(body)
        });
        return NextResponse.json(await backendResponse.json());
    } catch (error) {
        return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const backendResponse = await fetch(`http://localhost:3000/api/v1/users/education/${id}`, {
            method: 'DELETE',
            headers: request.headers
        });
        return NextResponse.json(await backendResponse.json());
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
    }
}