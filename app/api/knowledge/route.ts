import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - 获取知识库列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");

    const items = await prisma.knowledgeBase.findMany({
      where: category ? { category } : undefined,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("获取知识库失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// POST - 创建知识条目
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 获取当前用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const formData = await request.formData();
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;

    let content = "";
    let question = null;
    let answer = null;
    let fileName = null;
    let fileType = null;
    let fileUrl = null;

    if (type === "DOCUMENT") {
      const file = formData.get("file") as File;
      if (file) {
        // 在实际生产环境中，这里应该上传到云存储（如阿里云OSS、AWS S3等）
        // 这里仅作示例，存储文件名和类型
        fileName = file.name;
        fileType = file.type;
        fileUrl = `/uploads/${Date.now()}_${file.name}`; // 示例URL
        
        // 文档解析逻辑应该在这里实现
        // 例如使用 mammoth（docx）、xlsx（excel）、pdf-parse（pdf）等库
        content = `文档内容将在上传后自动解析。文件名: ${fileName}`;
      }
    } else if (type === "QA") {
      question = formData.get("question") as string;
      answer = formData.get("answer") as string;
      content = formData.get("content") as string;
    } else {
      content = formData.get("content") as string;
    }

    const knowledge = await prisma.knowledgeBase.create({
      data: {
        title,
        content,
        type,
        category,
        question,
        answer,
        fileName,
        fileType,
        fileUrl,
        authorId: user.id,
        tags: "[]", // 可以后续添加标签功能
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("创建知识失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

