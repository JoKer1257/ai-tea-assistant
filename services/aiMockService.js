// AI 模拟服务 - 用于开发阶段的智能回复
export class AIMockService {
  constructor() {
    // 茶知识库
    this.teaKnowledge = {
      '龙井': {
        name: '西湖龙井',
        description: '产于杭州西湖山区，中国十大名茶之一。明前采摘，一芽一叶，炒制扁平光滑，色泽翠绿。冲泡水温85°C，投茶3g，注水150ml，浸泡2-3分钟。香气豆香明显，滋味甘醇鲜爽。',
        brewing: '水温85°C，投茶3g，浸泡2-3分钟',
        origin: '杭州西湖山区',
        season: '清明前后'
      },
      '大红袍': {
        name: '武夷大红袍',
        description: '岩茶之王，产于武夷山九龙窠，生长在岩壁之上。条索紧结，色泽乌褐，汤色橙黄明亮。岩韵明显，兰花香持久，滋味醇厚回甘。',
        brewing: '水温95°C，投茶5g，浸泡3-5分钟',
        origin: '武夷山九龙窠',
        season: '春秋两季'
      },
      '铁观音': {
        name: '安溪铁观音',
        description: '乌龙茶代表，产于福建安溪。卷曲紧结如蜻蜓头，砂绿油润。香气高扬，有天然的兰花香。滋味醇厚甘鲜，回甘悠长，七泡仍有余香。',
        brewing: '水温100°C，投茶7g，浸泡2-3分钟',
        origin: '福建安溪',
        season: '春秋两季'
      },
      '白毫银针': {
        name: '福鼎白毫银针',
        description: '白茶极品，产于福建福鼎。满披白毫，如针似雪。只采单芽，不炒不揉，自然萎凋。滋味清鲜淡雅，毫香显露，汤色杏黄明亮。',
        brewing: '水温80°C，投茶3g，浸泡2-3分钟',
        origin: '福建福鼎',
        season: '清明前后'
      },
      '普洱': {
        name: '普洱茶',
        description: '云南特产，分为生普和熟普。生普香气清新，熟普醇厚温和。具有越陈越香的特点，适合长期储存。',
        brewing: '水温100°C，投茶5g，生普3-5分钟，熟普2-3分钟',
        origin: '云南',
        season: '全年适宜'
      },
      '碧螺春': {
        name: '洞庭碧螺春',
        description: '产于江苏苏州洞庭山，外形卷曲如螺，白毫显露。香气清雅，滋味鲜爽，汤色碧绿清澈。',
        brewing: '水温80°C，投茶3g，浸泡2-3分钟',
        origin: '苏州洞庭山',
        season: '清明前后'
      }
    }

    // 意图识别规则
    this.intentRules = {
      brewing: ['怎么泡', '冲泡', '水温', '时间', '步骤', '泡法'],
      recommend: ['推荐', '适合', '喜欢', '想喝', '口感', '建议'],
      origin: ['产地', '哪里', '哪里产', '来源', '出自'],
      season: ['季节', '什么时候', '什么时候采', '春茶', '秋茶'],
      health: ['功效', '作用', '健康', '好处', '营养'],
      price: ['价格', '多少钱', '贵不贵', '成本'],
      storage: ['保存', '储存', '存放', '保鲜']
    }

    // 通用回复模板
    this.defaultResponses = [
      '茶友，关于您提到的这款茶，每款茶都有其独特的魅力。建议您提供更具体的茶名，我将为您详细解读。',
      '这是一款值得品味的茶品。不同的冲泡方式会带来不同的体验，您是想了解冲泡方法吗？',
      '茶道博大精深，每款茶都有其独特的故事。您是想了解产地、工艺还是品饮方法呢？',
      '好茶需要细品。您提到的这个问题很有意思，建议您先从基础的冲泡方法开始了解。'
    ]
  }

  /**
   * 生成 AI 回复
   */
  generateResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    // 1. 检查是否包含具体茶名
    for (const [teaKey, teaInfo] of Object.entries(this.teaKnowledge)) {
      if (lowerMessage.includes(teaKey)) {
        return this.generateTeaResponse(teaInfo, message)
      }
    }

    // 2. 识别意图并生成相应回复
    const intent = this.detectIntent(lowerMessage)
    if (intent) {
      return this.generateIntentResponse(intent, message)
    }

    // 3. 返回通用回复
    return this.getDefaultResponse()
  }

  /**
   * 生成具体茶品的回复
   */
  generateTeaResponse(teaInfo, message) {
    const responses = []

    // 基础介绍
    responses.push(`关于${teaInfo.name}，${teaInfo.description}`)

    // 根据问题内容添加相关信息
    if (message.includes('泡') || message.includes('冲泡') || message.includes('水温')) {
      responses.push(`冲泡建议：${teaInfo.brewing}`)
    }

    if (message.includes('产地') || message.includes('哪里')) {
      responses.push(`产地：${teaInfo.origin}`)
    }

    if (message.includes('季节') || message.includes('什么时候')) {
      responses.push(`最佳采摘季节：${teaInfo.season}`)
    }

    // 添加品饮建议
    responses.push('品饮时建议先闻其香，再观其色，最后品味其韵。好茶需要静心细品。')

    return responses.join('\n\n')
  }

  /**
   * 检测用户意图
   */
  detectIntent(message) {
    for (const [intent, keywords] of Object.entries(this.intentRules)) {
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          return intent
        }
      }
    }
    return null
  }

  /**
   * 根据意图生成回复
   */
  generateIntentResponse(intent, message) {
    switch (intent) {
      case 'brewing':
        return '冲泡茶品需要根据茶叶特性调整。一般来说，绿茶用80-85°C水温，红茶用95°C，乌龙茶用100°C。投茶量约为茶具容量的1/5，浸泡时间从30秒到3分钟不等。建议您先了解具体茶类，再调整冲泡参数。'
      
      case 'recommend':
        return '选茶如选友，需根据个人喜好。如果您喜欢清新口感，推荐绿茶或白茶；喜欢醇厚口感，可选红茶或普洱；喜欢花果香气，乌龙茶是不错的选择。建议您从入门级的龙井或铁观音开始尝试。'
      
      case 'origin':
        return '中国茶文化源远流长，各地都有名茶。江南地区以绿茶为主，如龙井、碧螺春；福建盛产乌龙茶，如铁观音、大红袍；云南以普洱闻名；安徽有黄山毛峰、祁门红茶等。每个产地的茶都有其独特风味。'
      
      case 'season':
        return '茶叶采摘有严格的季节性。春茶品质最佳，清明前后的明前茶最为珍贵；夏茶生长快但品质稍次；秋茶香气浓郁；冬茶产量稀少。不同季节的茶各有特色，春茶鲜爽，秋茶醇厚。'
      
      case 'health':
        return '茶有多种健康功效：提神醒脑、抗氧化、助消化、降血脂等。绿茶富含茶多酚，红茶茶黄素含量高，乌龙茶茶多糖丰富。但需适量饮用，避免空腹饮浓茶，睡前少饮茶。'
      
      case 'price':
        return '茶叶价格差异很大，从几十元到数万元不等。影响价格的因素包括：产地、品种、采摘时间、制作工艺、储存年限等。建议根据个人预算选择，日常饮用可选择百元左右的口粮茶。'
      
      case 'storage':
        return '茶叶保存需避光、防潮、防异味。绿茶、黄茶需密封冷藏；红茶、乌龙茶常温避光保存即可；普洱茶需要通风环境。建议使用专用的茶叶罐，避免与香料等异味物品存放。'
      
      default:
        return this.getDefaultResponse()
    }
  }

  /**
   * 获取默认回复
   */
  getDefaultResponse() {
    const randomIndex = Math.floor(Math.random() * this.defaultResponses.length)
    return this.defaultResponses[randomIndex]
  }

  /**
   * 流式生成回复（模拟真实 AI 的逐字输出）
   */
  async *streamResponse(message) {
    const response = this.generateResponse(message)
    const chars = response.split('')
    
    for (const char of chars) {
      yield { type: 'content', content: char }
      // 模拟打字速度
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    yield { type: 'done' }
  }
}

// 导出单例
export const aiMockService = new AIMockService()
