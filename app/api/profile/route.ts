import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        department: true,
        departmentCode: true,
        position: true,
        // 添加电话和简介字段（需要先在schema中添加）
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("获取个人信息失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, bio } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        // phone,  // 需要先在schema中添加
        // bio,    // 需要先在schema中添加
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        department: true,
        departmentCode: true,
        position: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新个人信息失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

