import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function VideoEmbed({ videoUrl, coverImageUrl, title }) {
 const [isPlaying, setIsPlaying] = useState(false);

 const getEmbedUrl = (url) => {
   if (!url) return '';
   if (url.includes('youtube.com') || url.includes('youtu.be')) {
     const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\.+&v=))([\w-]{11})/);
     return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : url;
   }
   if (url.includes('vimeo.com')) {
     const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
     return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : url;
   }
   return url;
 };

 if (!isPlaying) {
   return (
     <div
       className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900 group cursor-pointer"
       onClick={() => setIsPlaying(true)}
     >
       {coverImageUrl ? (
         <img
           src={coverImageUrl}
           alt={title || 'Video cover'}
           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
         />
       ) : (
         <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-sm">
           No Cover Image Available
         </div>
       )}
       <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center transition-colors group-hover:bg-slate-950/20">
         <div className="w-14 h-14 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
           <Play className="w-6 h-6 fill-current ml-1" />
         </div>
       </div>
     </div>
   );
 }

 return (
   <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-950">
     <iframe
       src={getEmbedUrl(videoUrl)}
       title={title || 'Video Player'}
       className="w-full h-full border-0"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
       allowFullScreen
     />
   </div>
 );
}
