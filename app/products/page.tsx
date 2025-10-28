"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string | null;
  price: number;
  stock: number;
  unit: string;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("获取产品列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-8">
      <PageHeader
        title="旅游线路管理"
        description="管理您的旅游产品和线路套餐"
        breadcrumbs={[{ label: "旅游线路" }]}
        action={
          <Button className="gap-2 rounded-full px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all button-apple">
            <Plus className="h-4 w-4" />
            添加线路
          </Button>
        }
      />

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-fadeIn">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索线路名称或编号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <CardTitle className="text-gray-900">线路列表 ({filteredProducts.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "没有找到匹配的线路" : "还没有旅游线路，点击上方按钮添加第一条线路"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-700 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">线路名称</th>
                    <th className="px-6 py-4 font-semibold">线路编号</th>
                    <th className="px-6 py-4 font-semibold">目的地</th>
                    <th className="px-6 py-4 font-semibold">人均价格</th>
                    <th className="px-6 py-4 font-semibold">余位</th>
                    <th className="px-6 py-4 font-semibold">状态</th>
                    <th className="px-6 py-4 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <tr 
                      key={product.id} 
                      className="hover:bg-green-50/50 transition-colors duration-200 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                      <td className="px-6 py-4 text-gray-600">{product.category || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ¥{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${product.stock <= 10 ? "text-red-600" : "text-gray-700"}`}>
                          {product.stock} {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            product.status === "ACTIVE"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                          }`}
                        >
                          {product.status === "ACTIVE" ? "在售" : "下架"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="rounded-full hover:bg-green-50 hover:text-green-600 transition-all button-apple"
                        >
                          编辑
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

