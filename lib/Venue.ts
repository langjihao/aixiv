import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchVenueFromDB = async (venue_name: string) => {
    const { data: venue, error } = await supabase
      .from('venues') 
      .select(`
        name,
        info
        `)
        .eq('name', venue_name)
        .single();
        if (error) {
            // 检查错误是否是因为没有找到记录
            if (error.code === 'PGRST116') {
              console.log(`Paper with venue ${venue_name} not found in database`);
              return null;
            }
            // 其他类型的错误仍然记录下来
            console.error('Error fetching from database:', error);
            return null;
          }
    return venue;
  };
export const storeVenue = async (venue: string, info: string) => {
    const { data, error } = await supabase
      .from('venues')
      .insert([
        { name: venue, info: info }
      ]);
    if (error) {
      console.error('Error storing venue:', error);
    }
  };
export const fetchVenue = async (venue: string) => {
    const venue_info = await fetchVenueFromDB(venue);
    if (venue_info) {
        return venue_info;
    } else {
        const url = `${process.env.NEXT_PUBLIC_EASY_SCHOLAR_BASE_URL}/open/getPublicationRank?secretKey=${process.env.NEXT_PUBLIC_EASY_SCHOLAR_API_KEY}&publicationName=${venue}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'         
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching venue details: ${response.statusText}`);
          }
        
          const data = await response.json();
          if (data.code === 200) {
            storeVenue(venue, data.data.officialRank.all);
          }
          return {name: venue, info: data.data.officialRank.all};
    }

}
