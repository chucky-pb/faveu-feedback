export type FeedbackCategory = 'UI' | '提案' | '映像面'
export type FeedbackPriority = '高' | '中' | '低'
export type FeedbackStatus = '未対応' | '対応中' | '完了' | '保留'

export interface Feedback {
  id: string
  content: string
  priority: FeedbackPriority | null
  author_name: string
  author_email: string
  notes: string | null
  category: FeedbackCategory | null
  status: FeedbackStatus
  created_at: string
}

export interface FeedbackFormData {
  author_name: string
  author_email: string
  category: FeedbackCategory
  priority: FeedbackPriority
  content: string
  notes: string
}
