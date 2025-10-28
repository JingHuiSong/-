import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 生成订单号
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `YJZ${year}${month}${day}${random}`;
}

// 计算天数和夜数
function calculateDaysNights(startDate: Date, endDate: Date) {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    days: diffDays + 1,
    nights: diffDays,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        quote: {
          select: {
            title: true,
            total: true,
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

    // 添加客户名称到订单对象
    const ordersWithCustomerName = orders.map((order) => ({
      ...order,
      customerName: order.customer?.name || "",
    }));

    return NextResponse.json(ordersWithCustomerName);
  } catch (error) {
    console.error("获取订单列表失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const body = await request.json();
    const {
      customerId,
      quoteId,
      title,
      startDate,
      endDate,
      travelers,
      totalAmount,
      notes,
    } = body;

    // 计算天数和夜数
    let days = null;
    let nights = null;
    if (startDate && endDate) {
      const result = calculateDaysNights(new Date(startDate), new Date(endDate));
      days = result.days;
      nights = result.nights;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId,
        quoteId: quoteId || null,
        agentId: user.id,
        status: "DRAFT",
        title,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        days,
        nights,
        travelers,
        totalAmount,
        paidAmount: 0,
        paymentStatus: "UNPAID",
        notes,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("创建订单失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

