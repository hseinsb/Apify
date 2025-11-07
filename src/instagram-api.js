import axios from 'axios';

/**
 * Get Instagram reel data using oEmbed API (no login required)
 * This is a fallback method that works without proxy
 */
export async function getReelDataViaAPI(reelUrl) {
    try {
        console.log('🌐 Trying Instagram oEmbed API...');
        
        // Instagram's oEmbed endpoint
        const apiUrl = `https://www.instagram.com/oembed/?url=${encodeURIComponent(reelUrl)}`;
        
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
            timeout: 10000,
        });
        
        if (response.data) {
            console.log('✅ Got data from oEmbed API');
            
            // Extract data from oEmbed response
            const data = {
                caption: response.data.title || '',
                author: {
                    username: response.data.author_name || '',
                    fullName: response.data.author_name || '',
                },
                timestamp: new Date().toISOString(),
                hashtags: [],
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                videoUrl: '',
            };
            
            // Extract hashtags from title
            if (data.caption) {
                const hashtagMatches = data.caption.match(/#\w+/g);
                if (hashtagMatches) {
                    data.hashtags = hashtagMatches;
                }
            }
            
            return data;
        }
        
        return null;
    } catch (error) {
        console.log('❌ oEmbed API failed:', error.message);
        return null;
    }
}

