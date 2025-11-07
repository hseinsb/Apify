import { Actor } from 'apify';
import { chromium } from 'playwright';

/**
 * Scrape Instagram Reel data using Playwright
 * @param {string} url - Instagram Reel URL
 * @param {object} proxyConfig - Proxy configuration
 * @returns {object} Reel data including caption, hashtags, stats, and video URL
 */
export async function scrapeInstagramReel(url, proxyConfig) {
    let browser;
    let context;
    
    try {
        // Configure browser options
        const launchOptions = {
            headless: true,
        };

        // Configure proxy if provided
        let contextOptions = {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
        };

        // Handle Apify proxy configuration
        if (proxyConfig?.useApifyProxy) {
            const proxyConfiguration = await Actor.createProxyConfiguration({
                groups: proxyConfig.apifyProxyGroups || ['RESIDENTIAL'],
            });
            const proxyUrl = await proxyConfiguration.newUrl();
            contextOptions.proxy = {
                server: proxyUrl,
            };
            console.log('✓ Using Apify proxy');
        } else if (proxyConfig?.proxyUrls && proxyConfig.proxyUrls.length > 0) {
            contextOptions.proxy = {
                server: proxyConfig.proxyUrls[0],
            };
            console.log('✓ Using custom proxy');
        }

        console.log('Launching browser...');
        browser = await chromium.launch(launchOptions);
        context = await browser.newContext(contextOptions);
        
        const page = await context.newPage();

        // Set extra headers to appear more legitimate
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        });

        console.log(`Navigating to: ${url}`);
        
        // Navigate to the reel URL
        await page.goto(url, { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });

        // Wait for content to load
        await page.waitForTimeout(5000);
        
        // Take screenshot for debugging
        console.log('Page loaded, attempting extraction...');
        
        // Get page content for debugging
        const content = await page.content();
        console.log('Page title:', await page.title());

        // Try to extract data from the page
        const reelData = await page.evaluate(() => {
            const data = {
                caption: '',
                hashtags: [],
                viewCount: 0,
                likeCount: 0,
                commentCount: 0,
                videoUrl: '',
                author: {},
                timestamp: new Date().toISOString()
            };

            // Extract video URL from video element or source elements
            const videoElement = document.querySelector('video');
            if (videoElement) {
                if (videoElement.src) {
                    data.videoUrl = videoElement.src;
                } else {
                    // Try source elements
                    const sourceElement = videoElement.querySelector('source');
                    if (sourceElement && sourceElement.src) {
                        data.videoUrl = sourceElement.src;
                    }
                }
            }

            // Try multiple methods to get caption
            // Method 1: Meta tags
            const captionMeta = document.querySelector('meta[property="og:description"]');
            if (captionMeta && captionMeta.content) {
                data.caption = captionMeta.content;
            }
            
            // Method 2: Try structured data
            if (!data.caption) {
                const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                for (const script of scripts) {
                    try {
                        const json = JSON.parse(script.textContent);
                        if (json.description) {
                            data.caption = json.description;
                            break;
                        }
                    } catch (e) {}
                }
            }
            
            // Method 3: Look for Instagram's internal data
            if (!data.caption) {
                const allScripts = document.querySelectorAll('script');
                for (const script of allScripts) {
                    const text = script.textContent;
                    if (text.includes('caption')) {
                        try {
                            // Try to extract caption from Instagram's data
                            const matches = text.match(/"caption":"([^"]+)"/);
                            if (matches && matches[1]) {
                                data.caption = matches[1];
                                break;
                            }
                        } catch (e) {}
                    }
                }
            }

            // Extract hashtags from caption
            if (data.caption) {
                const hashtagMatches = data.caption.match(/#\w+/g);
                if (hashtagMatches) {
                    data.hashtags = hashtagMatches;
                }
            }

            // Try to extract author information from multiple sources
            let authorFound = false;
            
            // Method 1: OG tags
            const authorMeta = document.querySelector('meta[property="og:title"]');
            if (authorMeta && authorMeta.content) {
                const titleContent = authorMeta.content;
                const usernameMatch = titleContent.match(/@(\w+)/);
                if (usernameMatch) {
                    data.author.username = usernameMatch[1];
                    authorFound = true;
                }
                const nameMatch = titleContent.match(/^([^@]+)/);
                if (nameMatch) {
                    data.author.fullName = nameMatch[1].trim();
                }
            }
            
            // Method 2: Try to find from URL or page structure
            if (!authorFound) {
                const urlMatch = window.location.pathname.match(/\/([^\/]+)\/reel/);
                if (urlMatch) {
                    data.author.username = urlMatch[1];
                }
            }

            // Extract metrics from Instagram's internal data structure
            const allScripts = document.querySelectorAll('script');
            let metricsFound = false;
            
            for (const script of allScripts) {
                const text = script.textContent;
                if (text.includes('video_view_count') || text.includes('play_count')) {
                    try {
                        // Try to extract view count
                        const viewMatch = text.match(/"video_view_count":(\d+)/);
                        if (viewMatch) {
                            data.viewCount = parseInt(viewMatch[1]);
                            metricsFound = true;
                        }
                        
                        // Try to extract like count
                        const likeMatch = text.match(/"like_count":(\d+)/);
                        if (likeMatch) {
                            data.likeCount = parseInt(likeMatch[1]);
                        }
                        
                        // Try to extract comment count
                        const commentMatch = text.match(/"comment_count":(\d+)/);
                        if (commentMatch) {
                            data.commentCount = parseInt(commentMatch[1]);
                        }
                        
                        if (metricsFound) break;
                    } catch (e) {}
                }
            }
            
            // Fallback: Try text patterns if internal data not found
            if (!metricsFound) {
                const textContent = document.body ? document.body.innerText : '';
                
                // Look for view count patterns
                const viewPatterns = [
                    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:M|K|B)?\s*views?/i,
                    /(\d+(?:,\d+)*)\s*views?/i
                ];
                
                for (const pattern of viewPatterns) {
                    const match = textContent.match(pattern);
                    if (match) {
                        let views = match[1].replace(/,/g, '');
                        if (match[0].includes('M')) views = parseFloat(views) * 1000000;
                        else if (match[0].includes('K')) views = parseFloat(views) * 1000;
                        else if (match[0].includes('B')) views = parseFloat(views) * 1000000000;
                        data.viewCount = Math.floor(parseFloat(views));
                        break;
                    }
                }

                // Look for like count
                const likePatterns = [
                    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:M|K|B)?\s*likes?/i,
                ];
                
                for (const pattern of likePatterns) {
                    const match = textContent.match(pattern);
                    if (match) {
                        let likes = match[1].replace(/,/g, '');
                        if (match[0].includes('M')) likes = parseFloat(likes) * 1000000;
                        else if (match[0].includes('K')) likes = parseFloat(likes) * 1000;
                        else if (match[0].includes('B')) likes = parseFloat(likes) * 1000000000;
                        data.likeCount = Math.floor(parseFloat(likes));
                        break;
                    }
                }

                // Look for comment count
                const commentPatterns = [
                    /(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:M|K|B)?\s*comments?/i,
                ];
                
                for (const pattern of commentPatterns) {
                    const match = textContent.match(pattern);
                    if (match) {
                        let comments = match[1].replace(/,/g, '');
                        if (match[0].includes('M')) comments = parseFloat(comments) * 1000000;
                        else if (match[0].includes('K')) comments = parseFloat(comments) * 1000;
                        else if (match[0].includes('B')) comments = parseFloat(comments) * 1000000000;
                        data.commentCount = Math.floor(parseFloat(comments));
                        break;
                    }
                }
            }

            return data;
        });

        console.log('✓ Successfully extracted reel data');
        console.log(`Caption: ${reelData.caption.substring(0, 100)}...`);
        console.log(`Video URL: ${reelData.videoUrl ? 'Found' : 'Not found'}`);
        console.log(`Views: ${reelData.viewCount}, Likes: ${reelData.likeCount}, Comments: ${reelData.commentCount}`);

        return reelData;

    } catch (error) {
        console.log(`❌ Scraping error: ${error.message}`);
        throw error;
    } finally {
        if (context) await context.close();
        if (browser) await browser.close();
    }
}

