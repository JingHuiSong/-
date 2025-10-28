import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据...')

  // 清空现有数据
  await prisma.auditLog.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.knowledgeBase.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.quoteItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()

  // 创建管理员账户（唯一账户）
  const admin = await prisma.user.create({
    data: {
      email: 'admin@yuanjianzhe.com',
      name: '系统管理员',
      password: 'admin123456',
      role: 'ADMIN',
      department: '远见者旅行社',
    },
  })

  console.log('✅ 管理员账户创建完成')

  // 创建示例游客（使用管理员账户）
  const customer1 = await prisma.customer.create({
    data: {
      name: '张先生',
      email: 'zhang@example.com',
      phone: '13800138001',
      company: '科技有限公司',
      address: '北京市朝阳区',
      industry: '科技',
      status: 'ACTIVE',
      notes: 'VIP客户，偏好高端定制游',
      agentId: admin.id,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: '李女士',
      email: 'li@example.com',
      phone: '13800138002',
      company: '金融集团',
      address: '上海市浦东新区',
      industry: '金融',
      status: 'ACTIVE',
      notes: '多次预订，信誉良好',
      agentId: admin.id,
    },
  })

  console.log('✅ 示例游客创建完成')

  // 创建旅游线路
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: '三亚浪漫5日游',
        sku: 'SY-5D-001',
        description: '亚龙湾+蜈支洲岛+天涯海角，包含五星酒店住宿，私人导游',
        category: '海南',
        price: 5800,
        cost: 3500,
        stock: 20,
        unit: '人',
        status: 'ACTIVE',
      },
    }),
    prisma.product.create({
      data: {
        name: '云南深度7日游',
        sku: 'YN-7D-002',
        description: '丽江古城+香格里拉+洱海+玉龙雪山，纯玩无购物',
        category: '云南',
        price: 4200,
        cost: 2800,
        stock: 15,
        unit: '人',
        status: 'ACTIVE',
      },
    }),
    prisma.product.create({
      data: {
        name: '西藏朝圣10日游',
        sku: 'XZ-10D-003',
        description: '拉萨+林芝+纳木错+珠峰大本营，含高原适应',
        category: '西藏',
        price: 8900,
        cost: 6200,
        stock: 10,
        unit: '人',
        status: 'ACTIVE',
      },
    }),
    prisma.product.create({
      data: {
        name: '桂林山水4日游',
        sku: 'GL-4D-004',
        description: '漓江+阳朔+龙脊梯田+象鼻山，含游船',
        category: '广西',
        price: 2800,
        cost: 1800,
        stock: 25,
        unit: '人',
        status: 'ACTIVE',
      },
    }),
    prisma.product.create({
      data: {
        name: '张家界凤凰6日游',
        sku: 'ZJJ-6D-005',
        description: '天门山+玻璃栈道+凤凰古城+芙蓉镇',
        category: '湖南',
        price: 3600,
        cost: 2400,
        stock: 18,
        unit: '人',
        status: 'ACTIVE',
      },
    }),
  ])

  console.log('✅ 旅游线路创建完成')

  // 创建定制方案
  const quote1 = await prisma.quote.create({
    data: {
      quoteNumber: 'TZ-2025-0001',
      title: '张女士三亚蜜月5日定制游',
      customerId: customer1.id,
      agentId: admin.id,
      status: 'APPROVED',
      validUntil: new Date('2025-06-30'),
      discount: 0,
      tax: 0,
      total: 11600,
      notes: '蜜月旅行，安排浪漫晚餐和鲜花，升级海景房',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            price: 5800,
            discount: 0,
            total: 11600,
          },
        ],
      },
    },
  })

  const quote2 = await prisma.quote.create({
    data: {
      quoteNumber: 'TZ-2025-0002',
      title: '李女士云南深度7日游',
      customerId: customer2.id,
      agentId: admin.id,
      status: 'PENDING_APPROVAL',
      validUntil: new Date('2025-07-15'),
      discount: 0.05,
      tax: 0,
      total: 7980,
      notes: '对历史文化深度游感兴趣',
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 2,
            price: 4200,
            discount: 0.05,
            total: 7980,
          },
        ],
      },
    },
  })

  console.log('✅ 定制方案创建完成')

  // 创建审批
  await prisma.approval.create({
    data: {
      quoteId: quote1.id,
      submitterId: admin.id,
      approverId: admin.id,
      status: 'APPROVED',
      comments: '方案很好，已批准',
      approvedAt: new Date(),
    },
  })

  console.log('✅ 审批创建完成')

  // 创建旅游知识库（包含不同类型的知识）
  await prisma.knowledgeBase.createMany({
    data: [
      // 文本类型
      {
        title: '如何设计完美的定制旅游方案',
        type: 'TEXT',
        content: `# 如何设计完美的定制旅游方案

## 1. 深入了解游客需求
- 旅行目的（度假、蜜月、亲子、摄影等）
- 预算范围
- 时间安排
- 特殊要求

## 2. 线路规划
- 景点选择要有特色
- 行程节奏要合理
- 考虑季节和天气

## 3. 住宿和交通
- 根据预算选择合适档次的酒店
- 合理安排交通方式
- 预留充足的休息时间`,
        category: '定制服务',
        tags: JSON.stringify(['定制游', '方案设计', '最佳实践']),
        authorId: admin.id,
        published: true,
        views: 256,
      },
      // 问答类型
      {
        title: '三亚最佳旅游时间',
        type: 'QA',
        question: '什么时候去三亚旅游最好？',
        answer: '三亚最佳旅游时间是10月到次年4月。这个时期避开了台风季节，天气温暖舒适，平均气温25-28度，非常适合海滨度假。需要注意的是春节和国庆期间人流较多，价格也会上涨。',
        content: 'Q: 什么时候去三亚旅游最好？\nA: 三亚最佳旅游时间是10月到次年4月。这个时期避开了台风季节，天气温暖舒适，平均气温25-28度，非常适合海滨度假。需要注意的是春节和国庆期间人流较多，价格也会上涨。',
        category: '目的地指南',
        tags: JSON.stringify(['三亚', '旅游季节', 'FAQ']),
        authorId: admin.id,
        published: true,
        views: 342,
      },
      {
        title: '云南旅游注意事项',
        type: 'QA',
        question: '去云南旅游需要注意什么？',
        answer: '云南地处高原，需要注意：1. 做好防晒措施，紫外线强烈；2. 早晚温差大，准备外套；3. 高海拔地区注意高原反应；4. 尊重当地民族习俗；5. 准备常用药品。建议购买旅游保险。',
        content: 'Q: 去云南旅游需要注意什么？\nA: 云南地处高原，需要注意：1. 做好防晒措施，紫外线强烈；2. 早晚温差大，准备外套；3. 高海拔地区注意高原反应；4. 尊重当地民族习俗；5. 准备常用药品。建议购买旅游保险。',
        category: '目的地指南',
        tags: JSON.stringify(['云南', '注意事项', 'FAQ']),
        authorId: admin.id,
        published: true,
        views: 198,
      },
      {
        title: '如何处理游客投诉',
        type: 'QA',
        question: '游客投诉应该如何处理？',
        answer: '处理投诉的黄金法则：1. 倾听并表示理解；2. 诚恳道歉，即使不是我们的错；3. 提供解决方案，给出多个选项；4. 及时跟进，确保问题解决；5. 记录归档，避免类似问题再次发生。记住：一次成功的投诉处理可以变成忠实客户。',
        content: 'Q: 游客投诉应该如何处理？\nA: 处理投诉的黄金法则：1. 倾听并表示理解；2. 诚恳道歉，即使不是我们的错；3. 提供解决方案，给出多个选项；4. 及时跟进，确保问题解决；5. 记录归档，避免类似问题再次发生。记住：一次成功的投诉处理可以变成忠实客户。',
        category: '服务技巧',
        tags: JSON.stringify(['客户服务', '投诉处理', 'FAQ']),
        authorId: admin.id,
        published: true,
        views: 156,
      },
      // 文档类型（示例）
      {
        title: '2025年旅游市场趋势报告',
        type: 'DOCUMENT',
        content: '该文档包含2025年最新的旅游市场数据分析、趋势预测和营销建议。',
        fileName: '2025旅游市场趋势报告.pdf',
        fileType: 'application/pdf',
        fileUrl: '/uploads/2025-travel-trends.pdf',
        category: '政策法规',
        tags: JSON.stringify(['市场趋势', '报告', '数据分析']),
        authorId: admin.id,
        published: true,
        views: 89,
      },
      // 更多文本内容
      {
        title: '游客跟进技巧',
        type: 'TEXT',
        content: `# 游客跟进技巧

## 首次咨询后
24小时内发送详细方案

## 方案发送后
3天内进行电话回访

## 成交后
行程中保持联系，旅行结束后收集反馈

## 关键时间点
- 出发前7天：再次确认行程
- 出发前1天：发送温馨提示
- 旅行中：每天简短问候
- 回来后3天内：收集反馈和评价`,
        category: '服务技巧',
        tags: JSON.stringify(['客户服务', '跟进', '沟通']),
        authorId: admin.id,
        published: true,
        views: 234,
      },
    ],
  })

  console.log('✅ 旅游知识库创建完成')

  // 创建审计日志
  await prisma.auditLog.createMany({
    data: [
      {
        action: '创建定制方案',
        entity: 'Quote',
        entityId: quote1.id,
        userId: admin.id,
        changes: JSON.stringify({ status: 'created', quoteNumber: 'TZ-2025-0001' }),
        ipAddress: '192.168.1.100',
      },
      {
        action: '审批定制方案',
        entity: 'Quote',
        entityId: quote1.id,
        userId: admin.id,
        changes: JSON.stringify({ status: 'approved' }),
        ipAddress: '192.168.1.100',
      },
      {
        action: '创建游客信息',
        entity: 'Customer',
        entityId: customer1.id,
        userId: admin.id,
        changes: JSON.stringify({ name: '张先生', company: '科技有限公司' }),
        ipAddress: '192.168.1.100',
      },
    ],
  })

  console.log('✅ 审计日志创建完成')

  // 创建示例订单
  console.log('创建订单...')
  
  await prisma.order.createMany({
    data: [
      {
        orderNumber: 'YJZ25010001',
        customerId: customer1.id,
        quoteId: quote1.id,
        agentId: admin.id,
        status: 'CONFIRMED',
        title: '巴厘岛7天6晚蜜月之旅',
        startDate: new Date('2025-02-14'),
        endDate: new Date('2025-02-20'),
        days: 7,
        nights: 6,
        travelers: 2,
        totalAmount: 28000,
        paidAmount: 10000,
        paymentStatus: 'PARTIAL',
        notes: '客户要求海景房，需要安排蜜月布置',
      },
      {
        orderNumber: 'YJZ25010002',
        customerId: customer2.id,
        quoteId: quote2.id,
        agentId: admin.id,
        status: 'IN_PROGRESS',
        title: '日本关西5日文化体验之旅',
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-01-24'),
        days: 5,
        nights: 4,
        travelers: 4,
        totalAmount: 35000,
        paidAmount: 35000,
        paymentStatus: 'PAID',
        notes: '家庭出游，两大两小，需要安排亲子房',
      },
      {
        orderNumber: 'YJZ25010003',
        customerId: customer1.id,
        agentId: admin.id,
        status: 'DRAFT',
        title: '马尔代夫8天7晚奢华度假',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-03-17'),
        days: 8,
        nights: 7,
        travelers: 2,
        totalAmount: 68000,
        paidAmount: 0,
        paymentStatus: 'UNPAID',
        notes: '高端客户，要求水屋，含私人管家服务',
      },
      {
        orderNumber: 'YJZ25010004',
        customerId: customer1.id,
        agentId: admin.id,
        status: 'COMPLETED',
        title: '泰国普吉岛5天4晚休闲游',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-24'),
        days: 5,
        nights: 4,
        travelers: 3,
        totalAmount: 15000,
        paidAmount: 15000,
        paymentStatus: 'PAID',
        notes: '已顺利完成，客户满意度评分5星',
      },
      {
        orderNumber: 'YJZ25010005',
        customerId: customer2.id,
        agentId: admin.id,
        status: 'CANCELLED',
        title: '欧洲三国10日深度游',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-10'),
        days: 10,
        nights: 9,
        travelers: 2,
        totalAmount: 45000,
        paidAmount: 0,
        paymentStatus: 'REFUNDED',
        notes: '客户个人原因取消，已退还定金',
      },
    ],
  })

  console.log('✅ 订单创建完成')

  console.log('\n🎉 数据填充完成！')
  console.log('\n📊 统计：')
  console.log(`   用户: ${await prisma.user.count()}`)
  console.log(`   游客: ${await prisma.customer.count()}`)
  console.log(`   旅游线路: ${await prisma.product.count()}`)
  console.log(`   定制方案: ${await prisma.quote.count()}`)
  console.log(`   订单: ${await prisma.order.count()}`)
  console.log(`   审批记录: ${await prisma.approval.count()}`)
  console.log(`   知识库: ${await prisma.knowledgeBase.count()}`)
  console.log(`   审计日志: ${await prisma.auditLog.count()}`)
  console.log('\n🔐 管理员账号：')
  console.log(`   邮箱: admin@yuanjianzhe.com`)
  console.log(`   密码: admin123456`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

