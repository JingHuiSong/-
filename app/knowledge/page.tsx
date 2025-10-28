"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Search, Plus, Eye, Upload, MessageSquare, FileText, Trash2, Pencil, Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: "TEXT" | "QA" | "DOCUMENT";
  category: string;
  fileName?: string;
  fileType?: string;
  question?: string;
  answer?: string;
  views: number;
  createdAt: string;
}

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"TEXT" | "QA" | "DOCUMENT">("TEXT");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "定制服务",
    question: "",
    answer: "",
  });

  const categories = [
    { name: "定制服务", count: 12, color: "from-blue-500 to-blue-600", bgColor: "from-blue-50 to-blue-100" },
    { name: "目的地指南", count: 28, color: "from-green-500 to-green-600", bgColor: "from-green-50 to-green-100" },
    { name: "服务技巧", count: 15, color: "from-purple-500 to-purple-600", bgColor: "from-purple-50 to-purple-100" },
    { name: "政策法规", count: 8, color: "from-orange-500 to-orange-600", bgColor: "from-orange-50 to-orange-100" },
  ];

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (!res.ok) {
        throw new Error("获取失败");
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("获取知识库失败:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFormData({ ...formData, title: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append("type", uploadType);
    submitData.append("title", formData.title);
    submitData.append("category", formData.category);

    if (uploadType === "DOCUMENT" && selectedFile) {
      submitData.append("file", selectedFile);
    } else if (uploadType === "QA") {
      submitData.append("question", formData.question);
      submitData.append("answer", formData.answer);
      submitData.append("content", `Q: ${formData.question}\nA: ${formData.answer}`);
    } else {
      submitData.append("content", formData.content);
    }

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        body: submitData,
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setFormData({
          title: "",
          content: "",
          category: "定制服务",
          question: "",
          answer: "",
        });
        setSelectedFile(null);
        fetchKnowledge();
      }
    } catch (error) {
      console.error("保存失败:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条知识吗？")) return;
    
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchKnowledge();
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  const filteredItems = Array.isArray(items) ? items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "QA":
        return MessageSquare;
      case "DOCUMENT":
        return Upload;
      default:
        return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "QA":
        return "问答";
      case "DOCUMENT":
        return "文档";
      default:
        return "文本";
    }
  };

  return (
    <div className="p-8">
      <PageHeader
        title="知识库管理"
        description="管理旅游知识库，让AI助手更智能"
        breadcrumbs={[{ label: "知识库" }]}
        action={
          <Button 
            className="gap-2 rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            onClick={() => {
              setFormData({
                title: "",
                content: "",
                category: "定制服务",
                question: "",
                answer: "",
              });
              setSelectedFile(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            添加知识
          </Button>
        }
      />

      {/* AI助手集成提示 */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">智能知识库 + AI助手</h3>
            <p className="text-sm text-gray-600 mb-3">
              上传的知识会自动被AI助手学习，当用户提问时，AI会优先从知识库中检索相关内容，提供更准确、专业的回答。
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-blue-300 hover:bg-blue-50 text-blue-700"
                onClick={() => window.location.href = '/ai-chat'}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                前往AI助手测试
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 分类快捷入口 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map((cat, i) => (
          <Card 
            key={i} 
            className="border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            <CardContent className={`p-4 bg-gradient-to-br ${cat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                  <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                    {cat.count}
                  </p>
                </div>
                <BookOpen className={`h-8 w-8 bg-gradient-to-br ${cat.color} bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索框 */}
      <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索知识库内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 py-6 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* 知识列表 */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">还没有知识内容</p>
              <p className="text-sm text-gray-400">点击上方"添加知识"按钮开始创建</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item, i) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card 
                key={i} 
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:scale-110 transition-transform">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium">
                              {getTypeLabel(item.type)}
                            </span>
                          </div>
                          {item.type === "DOCUMENT" && item.fileName && (
                            <p className="text-xs text-gray-500 mt-1">📎 {item.fileName}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-14">
                        {item.type === "QA" ? (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Q: </span>
                              <span className="text-gray-600">{item.question}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">A: </span>
                              <span className="text-gray-600">{item.answer}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full font-medium text-xs">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {item.views} 次查看
                          </span>
                          <span>{new Date(item.createdAt).toLocaleDateString("zh-CN")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {item.type === "DOCUMENT" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* 添加知识对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              添加知识
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              选择合适的方式添加知识内容
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-6">
              {/* 选择类型 */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType("TEXT")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    uploadType === "TEXT"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileText className={`h-6 w-6 mx-auto mb-2 ${uploadType === "TEXT" ? "text-blue-600" : "text-gray-400"}`} />
                  <p className={`text-sm font-medium ${uploadType === "TEXT" ? "text-blue-900" : "text-gray-600"}`}>
                    文本段落
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("QA")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    uploadType === "QA"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MessageSquare className={`h-6 w-6 mx-auto mb-2 ${uploadType === "QA" ? "text-green-600" : "text-gray-400"}`} />
                  <p className={`text-sm font-medium ${uploadType === "QA" ? "text-green-900" : "text-gray-600"}`}>
                    问答对
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("DOCUMENT")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    uploadType === "DOCUMENT"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Upload className={`h-6 w-6 mx-auto mb-2 ${uploadType === "DOCUMENT" ? "text-purple-600" : "text-gray-400"}`} />
                  <p className={`text-sm font-medium ${uploadType === "DOCUMENT" ? "text-purple-900" : "text-gray-600"}`}>
                    上传文档
                  </p>
                </button>
              </div>

              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">标题</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="输入知识标题"
                  className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* 分类 */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">分类</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="rounded-lg border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="定制服务">定制服务</SelectItem>
                    <SelectItem value="目的地指南">目的地指南</SelectItem>
                    <SelectItem value="服务技巧">服务技巧</SelectItem>
                    <SelectItem value="政策法规">政策法规</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 根据类型显示不同输入 */}
              {uploadType === "TEXT" && (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">内容</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={6}
                    placeholder="输入文本内容..."
                    className="w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-3 text-sm"
                  />
                </div>
              )}

              {uploadType === "QA" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-sm font-medium text-gray-700">问题</Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      required
                      placeholder="输入问题..."
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-sm font-medium text-gray-700">答案</Label>
                    <textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      required
                      rows={4}
                      placeholder="输入答案..."
                      className="w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 p-3 text-sm"
                    />
                  </div>
                </>
              )}

              {uploadType === "DOCUMENT" && (
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                    文档文件 <span className="text-gray-400 text-xs">(支持 .docx, .xlsx, .pdf)</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      id="file"
                      type="file"
                      accept=".docx,.xlsx,.pdf,.doc,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      {selectedFile ? (
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-gray-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-700">点击选择文件或拖拽到此处</p>
                          <p className="text-xs text-gray-500 mt-1">支持 Word、Excel、PDF 格式</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="border-t border-gray-100 pt-6 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full px-6 border-gray-300"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
              >
                保存
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
