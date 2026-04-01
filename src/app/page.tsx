'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FeedbackFormData, FeedbackCategory, FeedbackPriority } from '@/types/feedback'
import { CheckCircle, AlertCircle } from 'lucide-react'

const categories: FeedbackCategory[] = ['UI', 'ææ¡', 'æ åé¢']
const priorities: FeedbackPriority[] = ['é«', 'ä¸­', 'ä½']

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    author_name: '',
    author_email: '',
    category: 'UI',
    priority: 'ä¸­',
    content: '',
    notes: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.author_name.trim()) {
      setError('ååãå¥åãã¦ãã ãã')
      return false
    }
    if (!formData.author_email.trim() || !formData.author_email.includes('@')) {
      setError('æå¹ãªã¡ã¼ã«ã¢ãã¬ã¹ãå¥åãã¦ãã ãã')
      return false
    }
    if (!formData.content.trim()) {
      setError('ãã£ã¼ãããã¯åå®¹ãå¥åãã¦ãã ãã')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { error: submitError } = await supabase.from('feedbacks').insert([
        {
          content: formData.content,
          priority: formData.priority,
          author_name: formData.author_name,
          author_email: formData.author_email,
          notes: formData.notes || null,
          category: formData.category,
          status: 'æªå¯¾å¿',
        },
      ])

      if (submitError) {
        setError(submitError.message || 'ãã£ã¼ãããã¯ã®éä¿¡ã«å¤±æãã¾ãã')
        return
      }

      setSubmitted(true)
      setFormData({
        author_name: '',
        author_email: '',
        category: 'UI',
        priority: 'ä¸­',
        content: '',
        notes: '',
      })

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      setError('äºæããªãã¨ã©ã¼ãçºçãã¾ãã')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-6 p-4 bg-gradient-primary rounded-xl">
            <div className="text-4xl font-bold text-white">F</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            FaveU
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">ãã£ã¼ãããã¯éä¿¡ãã©ã¼ã </p>
        </div>

        {submitted && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">ãã£ã¼ãããã¯ãéä¿¡ãã¾ãã</h3>
              <p className="text-sm text-green-700 dark:text-green-300">ãååãããã¨ããããã¾ãããã£ã¼ãããã¯ãç¢ºèªããã¦ããã ãã¾ãã</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">ã¨ã©ã¼ãçºçãã¾ãã</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                åå<span className="text-red-500">*</span>
              </label>
              <input
                id="author_name"
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                placeholder="å±±ç°å¤ªé"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="author_email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                ã¡ã¼ã«ã¢ãã¬ã¹<span className="text-red-500">*</span>
              </label>
              <input
                id="author_email"
                type="email"
                name="author_email"
                value={formData.author_email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                placeholder="yamada@example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                ã«ãã´ãª
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth cursor-pointer"
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                åªååº¦
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth cursor-pointer"
                disabled={loading}
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {pri}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              ãã£ã¼ãããã¯åå®¹<span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-smooth"
              placeholder="ããã«ãã£ã¼ãããã¯ãå¥åãã¦ãã ãã..."
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              è£è¶³ï¼ãªãã·ã§ã³ï¼
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-smooth"
              placeholder="è¿½å ã®æå ±ãããã°å¥åãã¦ãã ãã..."
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-smooth transform hover:scale-105 active:scale-95"
          >
            {loading ? 'éä¿¡ä¸­...' : 'ãã£ã¼ãããã¯ãéä¿¡'}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
            <p>FaveUã®ãµã¼ãã¹åä¸ã«ãååãã ãã</p>
          </div>
        </form>

        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            ç®¡çç»é¢ã¯{' '}
            <a
              href="/dashboard"
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              ãã¡ã
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
