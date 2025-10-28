import { NextRequest, NextResponse } from "next/server";

const ARK_API_KEY = "d946b46c-ac01-427e-958a-94aa53125eb7";
const ARK_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
const MODEL_NAME = "doubao-seed-1-6-flash-250828";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "消息格式不正确" },
        { status: 400 }
      );
    }

    // 添加系统提示词，专注于旅游定制服务
    const systemMessage = {
      role: "system",
      content: `你是一个专业的旅游定制助手，专门为客户提供个性化的旅游线路规划和建议。你需要：
1. 根据客户需求推荐合适的旅游目的地和路线
2. 提供详细的行程安排建议
3. 介绍景点特色、最佳游玩时间
4. 给出预算参考和注意事项
5. 回答关于签证、交通、住宿等问题
请用专业、友好的语气与客户交流。`,
    };

    // 调用豆包API
    const response = await fetch(ARK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("豆包API错误:", errorData);
      return NextResponse.json(
        { error: "AI服务暂时不可用，请稍后再试" },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message?.content || "抱歉，我没有理解您的问题";
      return NextResponse.json({ content });
    }

    return NextResponse.json(
      { error: "AI响应格式错误" },
      { status: 500 }
    );
  } catch (error) {
    console.error("AI对话处理错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

