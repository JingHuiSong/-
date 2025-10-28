import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

async function getSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      companyName: "远见者旅行社",
      companySlogan: "预见世界，预见自己",
      companyLogo: "/logo.png",
    };
  }
}

async function saveSettings(settings: any) {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await readFile(dataDir);
  } catch {
    const { mkdir } = await import("fs/promises");
    await mkdir(dataDir, { recursive: true });
  }
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { logo } = body;

    if (!logo) {
      return NextResponse.json({ error: "缺少Logo数据" }, { status: 400 });
    }

    const currentSettings = await getSettings();
    const newSettings = {
      ...currentSettings,
      companyLogo: logo,
    };

    await saveSettings(newSettings);

    return NextResponse.json({ logo });
  } catch (error) {
    console.error("上传Logo失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}

