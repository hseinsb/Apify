import { Actor } from 'apify';
import { scrapeInstagramReel } from './scraper.js';
import { transcribeAudio } from './transcription.js';
import { downloadVideo, extractAudioFromVideo, validateUrl, cleanInstagramUrl } from './utils.js';
import { getReelDataViaAPI } from './instagram-api.js';
import { getReelDataViaRapidAPIWithFallbacks } from './rapidapi.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Script loaded, initializing Actor...');
await Actor.init();
console.log('✅ Actor initialized');

try {
    console.log('📍 Entering try block...');
    console.log('🚀 Instagram Content Intelligence Pro - Starting...');
    
    console.log('📍 Getting input...');
    let input = await Actor.getInput();
    
    // Fallback: Read from INPUT.json file if running locally and no input found
    if (!input) {
        console.log('⚠️  No input from Apify SDK, trying local INPUT.json...');
        const inputPath = path.join(__dirname, '..', 'INPUT.json');
        console.log('📁 Reading from:', inputPath);
        if (fs.existsSync(inputPath)) {
            const inputContent = fs.readFileSync(inputPath, 'utf-8');
            console.log('📄 File content:', inputContent.substring(0, 200));
            input = JSON.parse(inputContent);
            console.log('✅ Loaded input from local INPUT.json file');
            console.log('🔗 URLs:', JSON.stringify(input.reelUrls));
        }
    }
    
    console.log('📍 Input retrieved:', input?.reelUrls?.length || 0, 'reel(s)');
    
    // Validate input
    if (!input?.reelUrls || !Array.isArray(input.reelUrls) || input.reelUrls.length === 0) {
        throw new Error('Invalid input: reelUrls must be a non-empty array');
    }

        // Get API keys from environment variables (managed by actor owner)
        const openaiApiKey = process.env.OPENAI_API_KEY;
        const assemblyaiApiKey = process.env.ASSEMBLYAI_API_KEY;
        const rapidApiKey = process.env.RAPIDAPI_KEY; // Embedded by actor owner
    
    // Validate API keys for transcription
    if (input.includeTranscript !== false) {
        if (!openaiApiKey && !assemblyaiApiKey) {
            throw new Error('Transcription API keys not configured. Please contact the actor owner.');
        }
    }
    
    // Log which extraction method will be used
    if (rapidApiKey) {
        console.log('✅ RapidAPI key found - will use API-based extraction (recommended)');
    } else {
        console.log('⚠️ No RapidAPI key - will use browser scraping (may be limited)');
    }
    
    // Set proxy configuration (disabled for local testing, enabled on Apify)
    const proxyConfig = {
        useApifyProxy: !!process.env.APIFY_TOKEN, // Only use proxy if APIFY_TOKEN exists
        apifyProxyGroups: ['RESIDENTIAL']
    };
    
    if (!process.env.APIFY_TOKEN) {
        console.log('⚠️ Running in LOCAL MODE (no APIFY_TOKEN) - Proxy disabled');
        console.log('Note: Instagram may show limited data without proxy');
    }

    console.log(`Starting Instagram Content Intelligence Pro actor`);
    console.log(`Processing ${input.reelUrls.length} reel(s)`);

    // Process each reel URL
    for (let i = 0; i < input.reelUrls.length; i++) {
        const url = input.reelUrls[i];
        console.log(`\n[${i + 1}/${input.reelUrls.length}] Processing: ${url}`);

        try {
                // Validate URL
                if (!validateUrl(url)) {
                    console.log(`⚠️ Invalid Instagram URL: ${url}`);
                    await Actor.pushData({
                        url,
                        error: 'Invalid Instagram Post/Reel URL. Must be in format: instagram.com/p/ID or instagram.com/reel/ID',
                        success: false
                    });
                    continue;
                }

            // Clean URL to remove tracking parameters
            const cleanedUrl = cleanInstagramUrl(url);
            if (cleanedUrl !== url) {
                console.log(`🧹 Cleaned URL: ${url} → ${cleanedUrl}`);
            }

            let reelData = null;

            // PRIMARY METHOD: Try RapidAPI first (if API key available)
            if (rapidApiKey) {
                try {
                    console.log('🚀 Extracting via RapidAPI (Primary method)...');
                    reelData = await getReelDataViaRapidAPIWithFallbacks(cleanedUrl, rapidApiKey);
                    console.log('✅ RapidAPI extraction successful!');
                } catch (rapidError) {
                    console.log(`⚠️ RapidAPI failed: ${rapidError.message}`);
                    console.log('📍 Falling back to browser scraping...');
                }
            }
            
            // FALLBACK 1: Browser scraping (if RapidAPI not available or failed)
            if (!reelData || !reelData.videoUrl) {
                console.log('🌐 Extracting via browser scraping...');
                reelData = await scrapeInstagramReel(cleanedUrl, proxyConfig);
            }
            
            // FALLBACK 2: Instagram oEmbed API (if browser scraping failed)
            if (!reelData || !reelData.videoUrl) {
                console.log('⚠️ Browser scraping failed, trying Instagram oEmbed API...');
                try {
                    const apiData = await getReelDataViaAPI(cleanedUrl);
                    if (apiData && (apiData.caption || apiData.videoUrl)) {
                        console.log('✓ Successfully got data from Instagram oEmbed API');
                        reelData = apiData;
                    }
                } catch (apiError) {
                    console.log(`⚠️ oEmbed API also failed: ${apiError.message}`);
                }
            }

            if (!reelData) {
                console.log(`⚠️ Failed to extract data from: ${url}`);
                await Actor.pushData({
                    url,
                    error: 'Failed to extract reel data',
                    success: false
                });
                continue;
            }

                // Prepare output object
                const output = {
                    url,
                    caption: reelData.caption || '',
                    hashtags: reelData.hashtags || [],
                    viewCount: parseInt(reelData.viewCount) || 0,
                    likeCount: parseInt(reelData.likeCount) || 0,
                    commentCount: parseInt(reelData.commentCount) || 0,
                    videoUrl: reelData.videoUrl || '',
                    author: reelData.author || {},
                    timestamp: reelData.timestamp || new Date().toISOString(),
                    success: true
                };

            // Handle transcription if requested
            if (input.includeTranscript !== false && reelData.videoUrl) {
                try {
                    console.log('Downloading video for transcription...');
                    const videoPath = await downloadVideo(reelData.videoUrl, `reel_${i}`);
                    
                    console.log('Extracting audio from video...');
                    const audioPath = await extractAudioFromVideo(videoPath);
                    
                    console.log('Transcribing audio...');
                    // Use OpenAI if available, otherwise AssemblyAI
                    const transcriptionService = openaiApiKey ? 'openai' : 'assemblyai';
                    const transcript = await transcribeAudio(
                        audioPath,
                        transcriptionService,
                        {
                            openaiApiKey: openaiApiKey,
                            assemblyaiApiKey: assemblyaiApiKey
                        }
                    );
                    
                    output.transcript = transcript || 'No speech detected';
                    console.log('✓ Transcription completed');
                } catch (transcriptionError) {
                    console.log(`⚠️ Transcription failed: ${transcriptionError.message}`);
                    output.transcript = '';
                    output.transcriptionError = transcriptionError.message;
                }
            } else {
                output.transcript = '';
            }

            // Save to dataset
            await Actor.pushData(output);
            
            // Show extracted data
            console.log('\n🎉 FINAL OUTPUT:');
            console.log(JSON.stringify(output, null, 2));
            console.log(`\n✓ Successfully processed reel ${i + 1}/${input.reelUrls.length}`);

        } catch (error) {
            console.log(`❌ Error processing reel ${url}: ${error.message}`);
            await Actor.pushData({
                url,
                error: error.message,
                success: false
            });
        }
    }

    console.log('\n✓ All reels processed successfully');

} catch (error) {
    console.log(`❌ Actor failed: ${error.message}`);
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
} finally {
    await Actor.exit();
}

