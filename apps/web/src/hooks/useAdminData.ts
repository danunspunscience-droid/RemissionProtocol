import { useState, useEffect, useCallback } from 'react';
import { HeroCopyRecord, HeroMediaRecord, ResourceRecord, LibraryContentRecord, FounderRecord } from '../types/admin';

export function useAdminData() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const [heroCopy, setHeroCopy] = useState<HeroCopyRecord | null>(null);
const [heroMedia, setHeroMedia] = useState<HeroMediaRecord[]>([]);
const [resources, setResources] = useState<ResourceRecord[]>([]);
const [libraryContent, setLibraryContent] = useState<LibraryContentRecord[]>([]);
const [founders, setFounders] = useState<FounderRecord[]>([]);

const fetchAll = useCallback(async () => {
 setLoading(true);
 setError(null);
 try {
   const [copyRes, mediaRes, resRes, libRes, foundersRes] = await Promise.all([
     fetch('/api/hero_copy'),
     fetch('/api/hero_media'),
     fetch('/api/resources'),
     fetch('/api/library_content'),
     fetch('/api/founders')
   ]);

   if (copyRes.ok) {
     const data = (await copyRes.json()) as { success: boolean; data: HeroCopyRecord };
     if (data.data) setHeroCopy(data.data);
   }
   if (mediaRes.ok) {
     const data = (await mediaRes.json()) as { success: boolean; data: HeroMediaRecord[] };
     if (data.data) setHeroMedia(data.data);
   }
   if (resRes.ok) {
     const data = (await resRes.json()) as { success: boolean; data: ResourceRecord[] };
     if (data.data) setResources(data.data);
   }
   if (libRes.ok) {
     const data = (await libRes.json()) as { success: boolean; data: LibraryContentRecord[] };
     if (data.data) setLibraryContent(data.data);
   }
   if (foundersRes.ok) {
     const data = (await foundersRes.json()) as { success: boolean; data: FounderRecord[] };
     if (data.data) setFounders(data.data);
   }
 } catch (err: any) {
   setError(err.message || 'Failed to hydrate admin dashboard state');
 } finally {
   setLoading(false);
 }
}, []);

useEffect(() => {
 fetchAll();
}, [fetchAll]);

return {
 loading,
 error,
 heroCopy,
 heroMedia,
 resources,
 libraryContent,
 founders,
 refresh: fetchAll
};
}
