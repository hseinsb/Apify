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
        
        // RapidAPI Instagram Reels Downloader endpoint
        const options = {
            method: 'GET',
            url: 'https://instagram-reels-downloader-api.p.rapidapi.com/download',
            params: { url: url },
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com'
            },
            timeout: 30000
        };

        const response = await axios.request(options);
        
        if (!response.data) {
            throw new Error('No data returned from RapidAPI');
        }

        console.log('✅ Successfully fetched data from RapidAPI');
        
        // Parse RapidAPI response (data is nested in response.data.data)
        const apiData = response.data.data;
        
        if (!apiData) {
            throw new Error('No data found in API response');
        }
        
        // Extract data from the actual response structure
        const reelData = {
            videoUrl: apiData.medias?.[0]?.url || '',
            caption: apiData.title || '',
            viewCount: parseInt(apiData.view_count || 0),
            likeCount: parseInt(apiData.like_count || 0),
            commentCount: 0, // This API doesn't provide comments
            author: {
                username: apiData.owner?.username || apiData.author || '',
                fullName: apiData.owner?.full_name || apiData.author || ''
            },
            timestamp: new Date().toISOString(),
            duration: apiData.duration || 0
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
        console.log(`   Views: ${reelData.viewCount || 0}`);
        console.log(`   Likes: ${reelData.likeCount || 0}`);
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

