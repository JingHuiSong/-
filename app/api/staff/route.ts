import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        departmentCode: true,
        position: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("获取员工列表失败:", error);
    return NextResponse.json(
      { error: "获取员工列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, department, departmentCode, position, permissions } = body;

    // 检查邮箱是否已存在
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "该邮箱已被使用" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // 注意：生产环境应使用bcrypt加密
        role,
        department,
        departmentCode,
        position,
        permissions,
        isActive: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      departmentCode: user.departmentCode,
      position: user.position,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("创建员工失败:", error);
    return NextResponse.json(
      { error: "创建员工失败" },
      { status: 500 }
    );
  }
}

