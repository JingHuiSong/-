import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE - 删除知识条目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    await prisma.knowledgeBase.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除知识失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}

// PUT - 更新知识条目
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const data = await request.json();
    
    const knowledge = await prisma.knowledgeBase.update({
      where: { id: params.id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        question: data.question,
        answer: data.answer,
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("更新知识失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

// GET - 获取单个知识条目（并增加浏览次数）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const knowledge = await prisma.knowledgeBase.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("获取知识失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

