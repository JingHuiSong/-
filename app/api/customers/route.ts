import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        agent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("获取客户列表失败:", error);
    return NextResponse.json(
      { error: "获取客户列表失败" },
      { status: 500 }
    );
  }
}

