"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Upload, Save, Check, AlertCircle, Image as ImageIcon } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState({
    companyName: "远见者旅行社",
    companySlogan: "预见世界，预见自己",
    companyLogo: "/logo.png",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("获取设置失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      showMessage("error", "请上传图片文件");
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "图片大小不能超过5MB");
      return;
    }

    setUploadingLogo(true);
    
    try {
      // 转换为Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // 上传Logo
        const res = await fetch("/api/settings/logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logo: base64String }),
        });

        if (!res.ok) throw new Error("上传失败");
        
        const data = await res.json();
        setSettings({ ...settings, companyLogo: data.logo });
        
        showMessage("success", "企业Logo更新成功");
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("上传Logo失败:", error);
      showMessage("error", "上传Logo失败");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: settings.companyName,
          companySlogan: settings.companySlogan,
        }),
      });

      if (!res.ok) throw new Error("保存失败");

      showMessage("success", "企业信息保存成功");
    } catch (error) {
      console.error("保存失败:", error);
      showMessage("error", "保存企业信息失败");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      <PageHeader
        title="企业设置"
        description="管理企业Logo和基本信息"
        breadcrumbs={[{ label: "企业设置" }]}
      />

      {/* 消息提示 */}
      {message && (
        <div className={`max-w-4xl mx-auto mt-4 p-4 rounded-xl flex items-center gap-3 animate-scaleIn ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-red-50 border border-red-200 text-red-800"
        }`}>
          {message.type === "success" ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-6 space-y-6">
        {/* 企业Logo卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              企业Logo
            </CardTitle>
            <CardDescription>点击Logo上传新图片，支持JPG、PNG、SVG格式，最大5MB</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div 
                  onClick={handleLogoClick}
                  className="relative w-48 h-48 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl group-hover:border-blue-400"
                >
                  {settings.companyLogo ? (
                    <img 
                      src={settings.companyLogo} 
                      alt="企业Logo"
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.src = "/logo-placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-sm">点击上传Logo</p>
                    </div>
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white">
                      <Upload className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">点击上传</p>
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                当前Logo将显示在登录页面和系统导航栏
              </p>
              <p className="text-xs text-gray-500">
                建议尺寸：512x512px，支持PNG、JPG、SVG格式
              </p>
            </div>
            </div>
          </CardContent>
        </Card>

        {/* 企业信息卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              企业信息
            </CardTitle>
            <CardDescription>编辑企业基本信息</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2 text-gray-700">
                  <Building2 className="h-4 w-4" />
                  企业名称 *
                </Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySlogan" className="flex items-center gap-2 text-gray-700">
                  <Building2 className="h-4 w-4" />
                  企业口号/标语 *
                </Label>
                <Input
                  id="companySlogan"
                  value={settings.companySlogan}
                  onChange={(e) => setSettings({ ...settings, companySlogan: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 rounded-lg"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg px-8 button-apple"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存更改
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 预览卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-xl font-bold text-gray-900">预览效果</CardTitle>
            <CardDescription>查看企业信息在系统中的显示效果</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2">
                  <img 
                    src={settings.companyLogo} 
                    alt="Logo预览"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/logo-placeholder.svg";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{settings.companyName}</h2>
                  <p className="text-blue-100 mt-1">{settings.companySlogan}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-blue-100">
                  这是企业信息在登录页面和系统导航栏的展示效果
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

