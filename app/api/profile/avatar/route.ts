import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "缺少图片数据" }, { status: 400 });
    }

    // 更新用户头像
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { image },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ image: user.image });
  } catch (error) {
    console.error("上传头像失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}

