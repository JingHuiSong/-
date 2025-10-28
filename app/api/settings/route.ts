import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json");

// 默认设置
const DEFAULT_SETTINGS = {
  companyName: "远见者旅行社",
  companySlogan: "预见世界，预见自己",
  companyLogo: "/logo.png",
};

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await readFile(dataDir);
  } catch {
    const { mkdir } = await import("fs/promises");
    await mkdir(dataDir, { recursive: true });
  }
}

async function getSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: any) {
  await ensureDataDir();
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("获取设置失败:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 检查是否是管理员
    // TODO: 添加管理员权限检查

    const body = await request.json();
    const { companyName, companySlogan } = body;

    const currentSettings = await getSettings();
    const newSettings = {
      ...currentSettings,
      companyName,
      companySlogan,
    };

    await saveSettings(newSettings);

    return NextResponse.json(newSettings);
  } catch (error) {
    console.error("保存设置失败:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

