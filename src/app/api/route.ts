import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const xg1 = searchParams.get("xg1");
  const xg2 = searchParams.get("xg2");

  if (!code || !xg1 || !xg2) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const auth = await prisma.user.findUnique({
      where: {
        code: code,
      },
    });

    // Check if the user is found
    if (!auth) {
      return NextResponse.json(
        {
          error: "Invalid code or user not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: auth,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
