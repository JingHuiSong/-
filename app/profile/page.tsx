"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, User, Mail, Phone, Building2, MapPin, Save, Upload, Check, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/skeleton";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  department?: string;
  departmentCode?: string;
  position?: string;
  bio?: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    name: "",
    email: "",
    image: "",
    phone: "",
    department: "",
    departmentCode: "",
    position: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("获取失败");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("获取个人信息失败:", error);
      showMessage("error", "获取个人信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      showMessage("error", "请上传图片文件");
      return;
    }

    // 验证文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "图片大小不能超过2MB");
      return;
    }

    setUploadingAvatar(true);
    
    try {
      // 转换为Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // 上传头像
        const res = await fetch("/api/profile/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        });

        if (!res.ok) throw new Error("上传失败");
        
        const data = await res.json();
        setFormData({ ...formData, image: data.image });
        
        // 更新session
        await update({ image: data.image });
        
        showMessage("success", "头像更新成功");
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("上传头像失败:", error);
      showMessage("error", "上传头像失败");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
        }),
      });

      if (!res.ok) throw new Error("保存失败");

      const data = await res.json();
      setFormData(data);
      
      // 更新session中的name
      await update({ name: data.name });
      
      showMessage("success", "个人信息保存成功");
    } catch (error) {
      console.error("保存失败:", error);
      showMessage("error", "保存个人信息失败");
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
        <PageHeader
          title="个人信息"
          description="管理您的个人资料和偏好设置"
          breadcrumbs={[{ label: "个人信息" }]}
        />
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
      <PageHeader
        title="个人信息"
        description="管理您的个人资料和偏好设置"
        breadcrumbs={[{ label: "个人信息" }]}
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
        {/* 头像卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              个人头像
            </CardTitle>
            <CardDescription>点击头像上传新图片，支持JPG、PNG格式，最大2MB</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div 
                  onClick={handleAvatarClick}
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-blue-500/30 cursor-pointer overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/40"
                >
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{formData.name?.charAt(0) || "U"}</span>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formData.name}</p>
                <p className="text-sm text-gray-500 mt-1">{formData.email}</p>
                {formData.position && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Building2 className="h-4 w-4" />
                    {formData.position}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              基本信息
            </CardTitle>
            <CardDescription>编辑您的个人资料</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4" />
                    姓名 *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4" />
                    邮箱（不可修改）
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="border-gray-200 bg-gray-50 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4" />
                    手机号码
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号码"
                    className="border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2 text-gray-700">
                    <Building2 className="h-4 w-4" />
                    所属部门（不可修改）
                  </Label>
                  <Input
                    id="department"
                    value={formData.department || "未分配"}
                    disabled
                    className="border-gray-200 bg-gray-50 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  个人简介
                </Label>
                <textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="介绍一下自己..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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

        {/* 账户信息卡片 */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-xl font-bold text-gray-900">账户信息</CardTitle>
            <CardDescription>查看您的账户详细信息</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">用户ID</p>
                  <p className="text-sm font-mono text-gray-900">{formData.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">部门代码</p>
                  <p className="text-sm font-semibold text-gray-900">{formData.departmentCode || "未分配"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">职位</p>
                  <p className="text-sm font-semibold text-gray-900">{formData.position || "未设置"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">邮箱验证</p>
                  <p className="text-sm font-semibold text-green-600">✓ 已验证</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

