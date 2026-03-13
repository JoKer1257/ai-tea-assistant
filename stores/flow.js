import { defineStore } from 'pinia'
import axios from 'axios'

// Ensure axios uses the correct backend base URL (FastAPI runs on 8000 by default)
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000
})

export const useFlowStore = defineStore('flow', {
    state: () => ({
        // AI Quiz Answers
        quizAnswers: {
            q1: '', // e.g. '清爽解腻'
            q2: '', // e.g. '办公'
            q3: ''  // e.g. '花香'
        },
        // AI Recommendation Result
        aiResult: {
            userType: '',     // e.g. '清润花香型'
            description: '',  // e.g. '你偏好轻盈细腻的茶香'
            skus: []          // Recommended products
        },
        // Lottery Result
        lotteryResult: {
            prizeId: null,
            prizeName: '',
            isWin: false
        },
        // User Form Info
        userInfo: {
            phone: ''
        }
    }),
    actions: {
        setAnswer(questionKey, value) {
            this.quizAnswers[questionKey] = value
        },
        setAiResult(result) {
            this.aiResult = result
        },
        setLotteryResult(result) {
            this.lotteryResult = result
        },
        setPhone(phone) {
            this.userInfo.phone = phone
        },
        async submitQuizToAi(brandId = 1) {
            try {
                // Call the FastAPI endpoint we just created
                const response = await apiClient.post('/ai/analyze-taste', {
                    brand_id: brandId,
                    q1: this.quizAnswers.q1,
                    q2: this.quizAnswers.q2,
                    q3: this.quizAnswers.q3
                })

                this.setAiResult({
                    userType: response.data.userType,
                    description: response.data.description,
                    skus: []
                })
                return true
            } catch (error) {
                console.error("AI Request failed:", error)
                // Fallback for safety so the user isn't stuck
                this.setAiResult({
                    userType: '雅客 · 清茗',
                    description: '茶童偶感风寒，未能即刻研判。这杯清茗，愿能为您扫落今日的纷扰。',
                    skus: []
                })
                return false
            }
        },
        resetFlow() {
            this.quizAnswers = { q1: '', q2: '', q3: '' }
            this.aiResult = { userType: '', description: '', skus: [] }
            this.lotteryResult = { prizeId: null, prizeName: '', isWin: false }
            this.userInfo = { phone: '' }
        }
    }
})
