import React from 'react';
import { VideoEmbed } from './VideoEmbed';

export function ContentCard({ item }) {
  const isVideo = item.media_type === 'video' || Boolean(item.video_url);

  const coverUrl = item.cover_image
    ? `/api/files/${item.cover_image}`
    : item.cover_url || null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full hover:border-slate-700 transition duration-200">
      {isVideo ? (
        <VideoEmbed
          videoUrl={item.video_url || item.url}
          coverImageUrl={coverUrl}
          title={item.title}
        />
      ) : coverUrl ? (
        <div className="aspect-video w-full overflow-hidden bg-slate-950">
          <img src={coverUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>
      ) : null}

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {item.category && (
            <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase mb-2 block">
              {item.category}
            </span>
          )}
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
            {item.summary || item.body_text}
          </p>
        </div>

        {item.key_insight && (
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
            <p className="text-xs font-medium text-teal-300">Key Insight: {item.key_insight}</p>
          </div>
        )}
      </div>
    </div>
  );
}