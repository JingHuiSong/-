import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 这里可以从数据库读取公告
    // 目前返回示例数据
    const announcements = [
      {
        id: 1,
        title: "系统升级通知",
        content: "本周六凌晨2:00-4:00进行系统维护，期间系统将无法访问。",
        date: new Date().toISOString().split("T")[0],
        type: "system",
        important: true,
      },
      {
        id: 2,
        title: "新产品培训",
        content: "下周三下午3点，会议室举行海南线路产品培训，请各位同事准时参加。",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        type: "training",
        important: false,
      },
      {
        id: 3,
        title: "优秀员工表彰",
        content: "恭喜张三、李四荣获本月优秀员工称号！",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        type: "praise",
        important: false,
      },
    ];

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("获取公告失败:", error);
    return NextResponse.json([], { status: 500 });
  }
}

