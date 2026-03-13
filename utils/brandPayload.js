const DEFAULT_THEME = {
  primary_color: '#1C1917',
  accent_color: '#CA8A04',
  bg_color: '#FAFAF9',
  template_id: 1
}

const normalizeThemeConfig = (themeConfig = {}, themeColor) => ({
  primary_color: themeConfig.primary_color || themeColor || DEFAULT_THEME.primary_color,
  accent_color: themeConfig.accent_color || DEFAULT_THEME.accent_color,
  bg_color: themeConfig.bg_color || DEFAULT_THEME.bg_color,
  template_id: themeConfig.template_id || DEFAULT_THEME.template_id
})

const normalizeBrand = (brand = {}) => ({
  id: brand.id ?? null,
  name: brand.name || '',
  slug: brand.slug || 'demo',
  slogan: brand.slogan || brand.description || '一叶知秋，雅遇茶缘',
  logo_url: brand.logo_url || '',
  hero_image: brand.hero_image || '',
  story_images: brand.story_images || [],
  theme_config: normalizeThemeConfig(brand.theme_config, brand.theme_color),
  ai_welcome: brand.ai_welcome || '你好，我是您的专属品茶顾问',
  ai_name: brand.ai_name || '茶小雅'
})

const normalizeSku = (sku = {}) => ({
  id: sku.id ?? null,
  name: sku.name || '',
  category: sku.category || '',
  cover_url: sku.cover_url || sku.image || '',
  flavor_tags: sku.flavor_tags || [],
  brew_params: sku.brew_params || sku.brew_guide || {},
  trace_info: sku.trace_info || {},
  ai_description: sku.ai_description || sku.description || '',
  origin: sku.origin || '',
  price: sku.price || ''
})

export const normalizeBrandPayload = (payload = {}) => {
  const source = payload?.data ?? payload
  const brand = normalizeBrand(source.brand || source)

  let skus = []
  if (Array.isArray(source.skus)) {
    skus = source.skus
  } else if (Array.isArray(source.items)) {
    skus = source.items
  } else if (source.sku) {
    skus = [source.sku]
  }

  return {
    brand,
    skus: skus.map(normalizeSku)
  }
}
