import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, password, role, department, departmentCode, position, permissions, isActive } = body;

    const updateData: any = {
      name,
      email,
      role,
      department,
      departmentCode,
      position,
      permissions,
    };

    // 只有提供了密码才更新
    if (password) {
      updateData.password = password;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
    console.error("更新员工失败:", error);
    return NextResponse.json(
      { error: "更新员工失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除员工失败:", error);
    return NextResponse.json(
      { error: "删除员工失败" },
      { status: 500 }
    );
  }
}

