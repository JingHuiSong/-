import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("获取产品列表失败:", error);
    return NextResponse.json(
      { error: "获取产品列表失败" },
      { status: 500 }
    );
  }
}

