import { User, ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

interface Props {
  authorName: string
  dateLabel: string
  excerpt: string
}

export default function ClaimHighlightSocialEmbed({ authorName, dateLabel, excerpt }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Post header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy">{authorName}</p>
          <p className="text-xs text-gray-400">{dateLabel}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Post body */}
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm leading-relaxed text-gray-600">{excerpt}</p>
      </div>

      {/* Separator */}
      <div className="mx-4 border-t border-gray-100" />

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2">
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50">
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}
