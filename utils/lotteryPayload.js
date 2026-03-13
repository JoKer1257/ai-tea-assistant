const DEFAULT_DESCRIPTION = '心有林泉，机缘自现。翻启一枚盲盒，试问今日茶缘。'

export const normalizeLotteryInfoResponse = (payload = {}) => {
  const source = payload?.data ?? payload

  if (!source?.active || !source.activity) {
    return {
      activityInfo: null,
      activityId: null,
      chancesLeft: 1,
      maxChances: 1,
      tileLabels: []
    }
  }

  const dailyLimit = Number(source.activity.daily_limit) || 1

  return {
    activityInfo: {
      id: source.activity.id,
      name: source.activity.name || '茶缘抽奖',
      description: source.activity.description || DEFAULT_DESCRIPTION
    },
    activityId: source.activity.id,
    chancesLeft: dailyLimit,
    maxChances: dailyLimit,
    tileLabels: (source.prizes || []).map((prize) => prize.name).filter(Boolean)
  }
}

export const buildDrawPayload = ({
  brandId,
  activityId,
  openid = 'mock_openid',
  scanSn = null
} = {}) => {
  const payload = {
    brand_id: Number(brandId),
    activity_id: Number(activityId),
    openid
  }

  if (scanSn) {
    payload.scan_sn = scanSn
  }

  return payload
}
