import axios from 'axios';

/**
 * Get Instagram reel data using RapidAPI Instagram Downloader
 * @param {string} url - Instagram reel URL
 * @param {string} apiKey - RapidAPI key
 * @returns {object} Reel data
 */
export async function getReelDataViaRapidAPI(url, apiKey) {
    try {
        console.log('🚀 Fetching data from RapidAPI Instagram Downloader...');
        
        // RapidAPI Instagram Downloader endpoint
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            },
            timeout: 30000
        };

        const response = await axios.request(options);
        
        if (!response.data) {
            throw new Error('No data returned from RapidAPI');
        }

        console.log('✅ Successfully fetched data from RapidAPI');
        
        // Parse RapidAPI response
        const data = response.data;
        
        // Extract data from response (structure varies by API)
        const reelData = {
            videoUrl: data.video_url || data.media?.[0]?.url || data.url || '',
            caption: data.caption || data.title || '',
            viewCount: parseInt(data.video_view_count || data.views || 0),
            likeCount: parseInt(data.like_count || data.likes || 0),
            commentCount: parseInt(data.comment_count || data.comments || 0),
            author: {
                username: data.username || data.owner?.username || '',
                fullName: data.owner?.full_name || data.owner_full_name || ''
            },
            timestamp: data.taken_at_timestamp 
                ? new Date(data.taken_at_timestamp * 1000).toISOString()
                : new Date().toISOString()
        };

        // Extract hashtags from caption
        if (reelData.caption) {
            const hashtagMatches = reelData.caption.match(/#[\w]+/g);
            reelData.hashtags = hashtagMatches || [];
        } else {
            reelData.hashtags = [];
        }

        console.log('📊 RapidAPI Data extracted:');
        console.log(`   Video URL: ${reelData.videoUrl ? '✅' : '❌'}`);
        console.log(`   Caption: ${reelData.caption ? '✅' : '❌'}`);
        console.log(`   Views: ${reelData.viewCount || 'N/A'}`);
        console.log(`   Author: ${reelData.author.username || 'N/A'}`);

        return reelData;
    } catch (error) {
        console.log(`❌ RapidAPI error: ${error.message}`);
        
        // If it's a rate limit error, provide helpful message
        if (error.response?.status === 429) {
            throw new Error('RapidAPI rate limit exceeded. Please check your subscription or wait.');
        }
        
        if (error.response?.status === 403) {
            throw new Error('Invalid RapidAPI key. Please check your API key.');
        }
        
        throw new Error(`RapidAPI failed: ${error.message}`);
    }
}

/**
 * Alternative: Try multiple RapidAPI services as fallbacks
 * @param {string} url - Instagram reel URL
 * @param {string} apiKey - RapidAPI key
 * @returns {object} Reel data
 */
export async function getReelDataViaRapidAPIWithFallbacks(url, apiKey) {
    // Try primary service
    try {
        return await getReelDataViaRapidAPI(url, apiKey);
    } catch (primaryError) {
        console.log('⚠️ Primary RapidAPI service failed, trying alternative...');
        
        // Try alternative RapidAPI service
        try {
            const options = {
                method: 'GET',
                url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/info',
                params: { code_or_id_or_url: url },
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
                },
                timeout: 30000
            };

            const response = await axios.request(options);
            const data = response.data?.data;
            
            if (!data) {
                throw new Error('No data from alternative API');
            }

            console.log('✅ Alternative RapidAPI service succeeded');
            
            return {
                videoUrl: data.video_url || '',
                caption: data.caption?.text || '',
                viewCount: parseInt(data.video_view_count || 0),
                likeCount: parseInt(data.like_count || 0),
                commentCount: parseInt(data.comment_count || 0),
                author: {
                    username: data.owner?.username || '',
                    fullName: data.owner?.full_name || ''
                },
                hashtags: data.caption?.text?.match(/#[\w]+/g) || [],
                timestamp: new Date().toISOString()
            };
        } catch (altError) {
            console.log('❌ All RapidAPI services failed');
            throw primaryError; // Throw original error
        }
    }
}

