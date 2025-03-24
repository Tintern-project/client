import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to your backend API
    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: response.status },
      );
    }

    // Set the auth token in an HTTP-only cookie
    const nextResponse = NextResponse.json({
      success: true,
      userId: data.user.Id,
      userEmail: data.user.email,
      userName: data.user.name,
    });

    // Set secure HTTP-only cookie for the token with longer max age
    nextResponse.cookies.set({
      name: "token",
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
