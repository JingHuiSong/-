import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 计算天数和夜数
function calculateDaysNights(startDate: Date, endDate: Date) {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    days: diffDays + 1,
    nights: diffDays,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        quote: true,
        agent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("获取订单失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
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
      status,
      paidAmount,
      paymentStatus,
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

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        customerId,
        quoteId: quoteId || null,
        title,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        days,
        nights,
        travelers,
        totalAmount,
        status,
        paidAmount: paidAmount !== undefined ? paidAmount : undefined,
        paymentStatus,
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

    return NextResponse.json(order);
  } catch (error) {
    console.error("更新订单失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除订单失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}

