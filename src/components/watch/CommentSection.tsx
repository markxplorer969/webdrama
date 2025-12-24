'use client'

import { useState } from 'react'
import { MessageCircle, Send, ChevronDown } from 'lucide-react'
import { addComment } from '@/lib/actions'

interface CommentSectionProps {
  bookId: string
  commentsCount?: number
}

interface Comment {
  id: string
  content: string
  userName: string
  timestamp: number
  likes: number
}

export default function CommentSection({ bookId, commentsCount = 0 }: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'Drama ini seru banget!',
      userName: 'User123',
      timestamp: Date.now() - 3600000,
      likes: 24,
    },
    {
      id: '2',
      content: 'Actingnya mantap, recommended!',
      userName: 'User456',
      timestamp: Date.now() - 7200000,
      likes: 18,
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    const result = await addComment(bookId, 'current_user', 'User Anonim', content.trim())

    if (result.success) {
      setContent('')
      // In production, you would fetch comments again here
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block space-y-3">
        <h3 className="text-lg font-semibold text-white">
          Komentar ({commentsCount})
        </h3>

        <div className="max-h-[300px] overflow-y-auto space-y-3 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-input rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary break-words">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span>{new Date(comment.timestamp).toLocaleDateString('id-ID')}</span>
                    <span>• {comment.likes} Suka</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full rounded-lg bg-input px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center gap-2 p-3 text-text-secondary transition-colors hover:text-white"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm">{commentsCount || 0} Komentar</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] w-full bg-surface rounded-t-2xl border-t border-neutral-800 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Komentar</h3>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white">
                ✕
              </button>
            </div>

            <div className="max-h-[40vh] overflow-y-auto space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-input rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary break-words">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span>{new Date(comment.timestamp).toLocaleDateString('id-ID')}</span>
                        <span>• {comment.likes} Suka</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="w-full rounded-lg bg-input px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
