import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to your backend API
    const response = await fetch("https://tintern-server.fly.dev/api/v1/auth/login", {
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
      userId: data.user.id,
      userEmail: data.user.email,
      userName: data.user.name,
      userPhone: data.user.phone,
    });

    // Set secure HTTP-only cookie for the token with longer max age
    nextResponse.cookies.set({
      name: "token",
      value: data.accessToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Using lax to allow cross-site navigation in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    // Also set user data in a non-httpOnly cookie for client access
    nextResponse.cookies.set({
      name: "user",
      value: JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        hasCV: data.user.hasCV || false,
      }),
      httpOnly: false, // Allow JavaScript access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
