import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
            company: true,
          },
        },
        agent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("获取报价列表失败:", error);
    return NextResponse.json(
      { error: "获取报价列表失败" },
      { status: 500 }
    );
  }
}

