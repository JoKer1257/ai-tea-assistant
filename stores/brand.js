import { defineStore } from 'pinia'
import { safeGet, logError } from '@/utils/errorHandler'
import { normalizeBrandPayload } from '@/utils/brandPayload'

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brandId: null,
    isLoaded: false,
    brand: {
      id: null,
      name: '',
      slug: '',
      slogan: '',
      logoUrl: '',
      heroImage: '',
      storyImages: [],
      theme: {
        primaryColor: '#1C1917',
        accentColor: '#CA8A04',
        bgColor: '#FAFAF9',
        templateId: 1
      },
      aiWelcome: '你好，我是您的专属品茶顾问',
      aiName: '茶小雅'
    },
    skus: [],
    currentSkuId: null,
    lotteryActivity: null
  }),

  getters: {
    currentSku: (state) => state.skus.find(s => s.id === state.currentSkuId) || state.skus[0] || null,
    themeVars: (state) => ({
      '--theme-primary': state.brand.theme.primaryColor,
      '--theme-accent': state.brand.theme.accentColor,
      '--theme-bg': state.brand.theme.bgColor,
      '--theme-text-main': '#0C0A09',
      '--theme-text-sub': '#78716C'
    })
  },

  actions: {
    async scanQrCode(bid, sid, sn) {
      try {
        const response = await safeGet('/scan', { bid, sid, sn })
        const normalized = normalizeBrandPayload(response)
        this._applyBrandData(String(bid), normalized.brand, normalized.skus)
        this.currentSkuId = sid ? Number(sid) : normalized.skus[0]?.id || null
        return true
      } catch (err) {
        logError('scanQrCode', err)
        this._applyMockData(bid, sid)
        return true
      }
    },

    async loadBrand(brandId) {
      try {
        const response = await safeGet(`/brands/${brandId}`)
        const normalized = normalizeBrandPayload(response)
        this._applyBrandData(String(brandId), normalized.brand, normalized.skus)
        return true
      } catch (err) {
        logError('loadBrand', err)
        this._applyMockData(brandId, null)
        return true
      }
    },

    _applyBrandData(brandId, brand, skus) {
      this.brandId = brandId
      this.isLoaded = true
      this.brand = {
        id: brand.id,
        name: brand.name || '雅鉴',
        slug: brand.slug || 'demo',
        slogan: brand.slogan || '一叶知秋，雅遇茶缘',
        logoUrl: brand.logo_url || '',
        heroImage: brand.hero_image || 'https://images.unsplash.com/photo-1576092762791-dd9e2220c4af?auto=format&fit=crop&q=80&w=800&h=1000',
        storyImages: brand.story_images || [],
        theme: {
          primaryColor: brand.theme_config?.primary_color || '#1C1917',
          accentColor: brand.theme_config?.accent_color || '#CA8A04',
          bgColor: brand.theme_config?.bg_color || '#FAFAF9',
          templateId: brand.theme_config?.template_id || 1
        },
        aiWelcome: brand.ai_welcome || '你好，我是您的专属品茶顾问',
        aiName: brand.ai_name || '茶小雅'
      }
      this.skus = (skus || []).map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        coverUrl: s.cover_url || 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=600',
        flavorTags: s.flavor_tags || [],
        brewParams: s.brew_params || {},
        traceInfo: s.trace_info || {},
        aiDescription: s.ai_description || '',
        origin: s.origin || '',
        price: s.price || ''
      }))
      if (this.skus.length === 0) {
        this.currentSkuId = null
      } else if (!this.skus.some((sku) => sku.id === this.currentSkuId)) {
        this.currentSkuId = this.skus[0].id
      }
    },

    _applyMockData(brandId, skuId) {
      this._applyBrandData(
        String(brandId),
        {
          id: Number(brandId),
          name: '雅鉴',
          slug: 'yajian',
          slogan: '一叶知秋，雅遇茶缘',
          hero_image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220c4af?auto=format&fit=crop&q=80&w=800&h=1000',
          story_images: [
            'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1610404419080-333e3ebdc896?auto=format&fit=crop&q=80&w=600'
          ],
          theme_config: { primary_color: '#1C1917', accent_color: '#CA8A04', bg_color: '#FAFAF9', template_id: 1 },
          ai_welcome: '您好，我是茶小雅，请问有什么可以为您效劳？',
          ai_name: '茶小雅'
        },
        [
          {
            id: 1, name: '凝霭 · 高山云雾', category: 'oolong',
            cover_url: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=600',
            flavor_tags: ['清幽', '回甘', '花香'], origin: '武夷山', price: '860',
            brew_params: { water_temp: 95, time_sec: 45, ratio: '1:15', steps: ['温杯', '投茶', '悬壶高冲', '出汤'] },
            trace_info: { batch_no: 'YJ2024001', farm_name: '云雾山茶园', inspect_url: '' },
            ai_description: '采自海拔1800米云雾高山，手工炭焙十二道工序。'
          },
          {
            id: 2, name: '岩骨 · 肉桂正岩', category: 'oolong',
            cover_url: 'https://images.unsplash.com/photo-1571407335606-5386dfd5ba2c?auto=format&fit=crop&q=80&w=600',
            flavor_tags: ['岩韵', '辛香', '醇厚'], origin: '武夷岩茶核心区', price: '1280',
            brew_params: { water_temp: 100, time_sec: 30, ratio: '1:12', steps: ['温杯', '投茶', '快速出汤', '循序加时'] },
            trace_info: { batch_no: 'YJ2024002', farm_name: '正岩茶园', inspect_url: '' },
            ai_description: '产自三坑两涧核心区，岩骨花香，久泡不苦。'
          }
        ]
      )
      if (skuId) this.currentSkuId = Number(skuId)
    },

    setCurrentSku(skuId) {
      this.currentSkuId = Number(skuId)
    }
  }
})
