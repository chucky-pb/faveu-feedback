'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Feedback, FeedbackCategory, FeedbackStatus } from '@/types/feedback'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Search, Calendar, Filter, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'

const COLORS = {
  UI: '#7c3aed',
  ææ¡: '#3b82f6',
  æ åé¢: '#ec4899',
  æªå¯¾å¿: '#ef4444',
  å¯¾å¿ä¸­: '#f59e0b',
  å®äº: '#10b981',
  ä¿ç: '#6b7280',
}

const STATUS_COLORS = {
  æªå¯¾å¿: '#ef4444',
  å¯¾å¿ä¸­: '#f59e0b',
  å®äº: '#10b981',
  ä¿ç: '#6b7280',
}

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus | 'all'>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<FeedbackStatus | ''>('')

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data || [])
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: FeedbackStatus) => {
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      )
      setEditingId(null)
      setEditingStatus('')
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.author_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || f.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || f.priority === selectedPriority

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    } else {
      const priorityOrder = { é«: 3, ä¸­: 2, ä½: 1, null: 0 }
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      return sortOrder === 'desc' ? priorityB - priorityA : priorityA - priorityB
    }
  })

  const stats = {
    total: feedbacks.length,
    byStatus: {
      æªå¯¾å¿: feedbacks.filter((f) => f.status === 'æªå¯¾å¿').length,
      å¯¾å¿ä¸­: feedbacks.filter((f) => f.status === 'å¯¾å¿ä¸­').length,
      å®äº: feedbacks.filter((f) => f.status === 'å®äº').length,
      ä¿ç: feedbacks.filter((f) => f.status === 'ä¿ç').length,
    },
    byCategory: feedbacks.reduce(
      (acc, f) => {
        const cat = f.category || 'ãã®ä»'
        acc[cat as FeedbackCategory] = (acc[cat as FeedbackCategory] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
  }

  const chartDataByStatus = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status,
    count,
  }))

  const chartDataByCategory = Object.entries(stats.byCategory)
    .map(([category, count]) => ({
      name: category,
      value: count,
    }))

  const chartDataTimeline = feedbacks
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .reduce(
      (acc, f) => {
        const date = new Date(f.created_at).toLocaleDateString('ja-JP')
        const existing = acc.find((item) => item.date === date)
        if (existing) {
          existing.count += 1
        } else {
          acc.push({ date, count: 1 })
        }
        return acc
      },
      [] as Array<{ date: string; count: number }>
    )
    .slice(-30)

  const handleToggleSort = (newSortBy: 'date' | 'priority') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              FaveU ããã·ã¥ãã¼ã
            </h1>
            <p className="text-gray-600 dark:text-gray-400">ãã£ã¼ãããã¯ç®¡çã¨åæ</p>
          </div>
          <button
            onClick={fetchFeedbacks}
            className="px-6 py-2 bg-gradient-primary hover:shadow-lg text-white font-semibold rounded-lg transition-smooth"
          >
            æ´æ°
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow hover:shadow-lg transition-smooth">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
              ç·ãã£ã¼ãããã¯æ°
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.total}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow hover:shadow-lg transition-smooth">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
              æªå¯¾å¿
            </p>
            <p className="text-3xl font-bold text-red-500">{stats.byStatus.æªå¯¾å¿}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow hover:shadow-lg transition-smooth">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
              å¯¾å¿ä¸­
            </p>
            <p className="text-3xl font-bold text-amber-500">{stats.byStatus.å¯¾å¿ä¸­}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow hover:shadow-lg transition-smooth">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
              å®äº
            </p>
            <p className="text-3xl font-bold text-green-500">{stats.byStatus.å®äº}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow hover:shadow-lg transition-smooth">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">
              ä¿ç
            </p>
            <p className="text-3xl font-bold text-gray-500">{stats.byStatus.ä¿ç}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ã¹ãã¼ã¿ã¹å¥
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name} ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartDataByStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name as FeedbackStatus]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ã«ãã´ãªå¥
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#7c3aed"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              æç³»åæ¨ç§»
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 card-shadow">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ãã£ã¼ãããã¯ä¸è¦§
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="æ¤ç´¢..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as FeedbackCategory | 'all')}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">å¨ã«ãã´ãª</option>
                  <option value="UI">UI</option>
                  <option value="ææ¡">ææ¡</option>
                  <option value="æ åé¢">æ åé¢</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus | 'all')}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">å¨ã¹ãã¼ã¿ã¹</option>
                  <option value="æªå¯¾å¿">æªå¯¾å¿</option>
                  <option value="å¯¾å¿ä¸­">å¯¾å¿ä¸­</option>
                  <option value="å®äº">å®äº</option>
                  <option value="ä¿ç">ä¿ç</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">å¨åªååº¦</option>
                  <option value="é«">é«</option>
                  <option value="ä¸­">ä¸­</option>
                  <option value="ä½">ä½</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleSort('date')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-smooth ${
                      sortBy === 'date'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {sortBy === 'date' && (sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />)}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">èª­ã¿è¾¼ã¿ä¸­...</p>
            </div>
          ) : sortedFeedbacks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">ãã£ã¼ãããã¯ã¯ããã¾ãã</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      æ¥æ
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      æåºè
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      åå®¹
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ã«ãã´ãª
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      åªååº¦
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ã¹ãã¼ã¿ã¹
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFeedbacks.map((feedback) => (
                    <tr
                      key={feedback.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-smooth"
                    >
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(feedback.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {feedback.author_name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {feedback.author_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 dark:text-white line-clamp-2 max-w-xs">
                          {feedback.content}
                        </p>
                        {feedback.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            è£è¶³: {feedback.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-full text-xs font-semibold">
                          {feedback.category || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            feedback.priority === 'é«'
                              ? 'bg-red-500'
                              : feedback.priority === 'ä¸­'
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                        >
                          {feedback.priority || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          onClick={() => {
                            setEditingId(feedback.id)
                            setEditingStatus(feedback.status)
                          }}
                          className="cursor-pointer"
                        >
                          {editingId === feedback.id ? (
                            <select
                              value={editingStatus}
                              onChange={(e) => {
                                updateStatus(feedback.id, e.target.value as FeedbackStatus)
                              }}
                              className="px-2 py-1 border border-purple-500 rounded text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                              autoFocus
                            >
                              <option value="æªå¯¾å¿">æªå¯¾å¿</option>
                              <option value="å¯¾å¿ä¸­">å¯¾å¿ä¸­</option>
                              <option value="å®äº">å®äº</option>
                              <option value="ä¿ç">ä¿ç</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                feedback.status === 'æªå¯¾å¿'
                                  ? 'bg-red-500'
                                  : feedback.status === 'å¯¾å¿ä¸­'
                                  ? 'bg-amber-500'
                                  : feedback.status === 'å®äº'
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                              }`}
                            >
                              {feedback.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-right">
            {sortedFeedbacks.length} / {feedbacks.length} ä»¶ãè¡¨ç¤ºä¸­
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-semibold"
          >
            ãã£ã¼ãããã¯ãã©ã¼ã ã«æ»ã
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
