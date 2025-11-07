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
        // Set headless based on environment (false for local testing, true for production)
        const isLocal = !process.env.APIFY_TOKEN;
        const launchOptions = {
            headless: !isLocal,  // Show browser locally, hide in production
            slowMo: isLocal ? 500 : 0,  // Slow down locally for debugging
        };

        // Configure proxy if provided
        let contextOptions = {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
        };

        // Handle Apify proxy configuration
        if (proxyConfig?.useApifyProxy) {
            try {
                const proxyConfiguration = await Actor.createProxyConfiguration({
                    groups: proxyConfig.apifyProxyGroups || ['RESIDENTIAL'],
                });
                if (proxyConfiguration) {
                    const proxyUrl = await proxyConfiguration.newUrl();
                    contextOptions.proxy = {
                        server: proxyUrl,
                    };
                    console.log('✓ Using Apify proxy');
                }
            } catch (proxyError) {
                console.log('⚠️ Proxy not available (running locally), continuing without proxy...');
                console.log('Note: Instagram may block requests without proxy');
            }
        } else if (proxyConfig?.proxyUrls && proxyConfig.proxyUrls.length > 0) {
            contextOptions.proxy = {
                server: proxyConfig.proxyUrls[0],
            };
            console.log('✓ Using custom proxy');
        } else {
            console.log('ℹ️  Running without proxy (local testing mode)');
        }

        console.log('🚀 Launching browser in VISIBLE mode...');
        console.log('👀 Watch the browser window to see what Instagram shows');
        browser = await chromium.launch(launchOptions);
        context = await browser.newContext(contextOptions);
        
        const page = await context.newPage();

        // Set extra headers to appear more legitimate
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        });

        console.log(`\n🌐 Navigating to: ${url}`);
        console.log('👀 WATCH THE BROWSER WINDOW - You\'ll see exactly what happens!\n');
        
        // Navigate to the reel URL
        await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });

        console.log('⏳ Waiting for page to fully render (15 seconds)...');
        await page.waitForTimeout(15000);
        
        // Close the login popup if it appears
        console.log('🔍 Checking for login popup...');
        let popupClosed = false;
        try {
            // Look for close button in the popup - try multiple approaches
            const closeSelectors = [
                'button[aria-label="Close"]',
                'svg[aria-label="Close"]',
                'div[role="dialog"] button',
                'div[role="dialog"] svg',
            ];
            
            for (const selector of closeSelectors) {
                try {
                    const elements = await page.$$(selector);
                    if (elements.length > 0) {
                        console.log(`✅ Found ${elements.length} potential close button(s) with selector: ${selector}`);
                        // Click the first visible one
                        for (const element of elements) {
                            const isVisible = await element.isVisible();
                            if (isVisible) {
                                console.log('🖱️  Clicking close button...');
                                await element.click();
                                popupClosed = true;
                                console.log('✅ Closed login popup!');
                                await page.waitForTimeout(3000);
                                break;
                            }
                        }
                        if (popupClosed) break;
                    }
                } catch (e) {
                    console.log(`⚠️ Selector ${selector} failed:`, e.message);
                }
            }
            
            if (!popupClosed) {
                console.log('ℹ️  No visible login popup found');
            }
        } catch (e) {
            console.log('⚠️ Error checking for popup:', e.message);
        }
        
        console.log('⏳ Waiting additional time for content to load...');
        await page.waitForTimeout(5000);
        
        // Wait for video element to have a src attribute
        console.log('🎥 Waiting for video to load...');
        try {
            await page.waitForSelector('video[src]', { timeout: 10000 });
            console.log('✅ Video element loaded with src!');
        } catch (e) {
            console.log('⚠️ Video element did not load src in time');
        }
        
        console.log('🔍 Page loaded, attempting extraction...');
        const pageTitle = await page.title();
        const pageUrl = page.url();
        console.log('📄 Page title:', pageTitle);
        console.log('🌐 Current URL:', pageUrl);
        
        // Check if we hit a login wall
        const pageContent = await page.content();
        const contentLength = pageContent.length;
        console.log(`📄 Page content length: ${contentLength} characters`);
        console.log('\n📄 PAGE CONTENT SAMPLE (first 500 chars):');
        console.log(pageContent.substring(0, 500));
        console.log('...\n');
        
        // Check if page is actually loaded
        if (contentLength < 1000) {
            console.log('🚫 ERROR: Page content is suspiciously short - Instagram may be blocking!');
            console.log('Full page content:', pageContent);
        }
        
        if (pageContent.includes('loginForm') || pageContent.includes('Log in to Instagram') || pageContent.includes('Login • Instagram')) {
            console.log('🚫 LOGIN WALL DETECTED - Instagram is requiring authentication');
        }
        
        // Check for blocked/not available messages
        if (pageContent.includes('not available') || pageContent.includes('isn\'t available')) {
            console.log('🚫 CONTENT BLOCKED - Instagram says content isn\'t available');
        }
        
        // Save screenshot for debugging
        try {
            await page.screenshot({ path: 'debug-screenshot.png' });
            console.log('📸 Screenshot saved to debug-screenshot.png');
        } catch (e) {
            console.log('Could not save screenshot');
        }

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
            console.log('🎥 Video element found:', !!videoElement);
            if (videoElement) {
                if (videoElement.src) {
                    data.videoUrl = videoElement.src;
                    console.log('✅ Video URL from src:', data.videoUrl.substring(0, 50));
                } else {
                    // Try source elements
                    const sourceElement = videoElement.querySelector('source');
                    if (sourceElement && sourceElement.src) {
                        data.videoUrl = sourceElement.src;
                        console.log('✅ Video URL from source:', data.videoUrl.substring(0, 50));
                    } else {
                        console.log('❌ No video src found');
                    }
                }
            } else {
                console.log('❌ No video element found on page');
            }

            // Try multiple methods to get caption
            // Method 1: Meta tags
            const captionMeta = document.querySelector('meta[property="og:description"]');
            console.log('📝 Caption meta tag found:', !!captionMeta);
            if (captionMeta && captionMeta.content) {
                data.caption = captionMeta.content;
                console.log('✅ Caption from meta:', data.caption.substring(0, 50));
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
                const hashtagMatches = data.caption.match(/#[\w]+/g);
                if (hashtagMatches) {
                    data.hashtags = hashtagMatches;
                }
            }
            
            // Try to extract likes and comments from caption if it contains them
            if (data.caption && data.likeCount === 0) {
                const likeMatch = data.caption.match(/(\d+)\s+likes?/i);
                if (likeMatch) {
                    data.likeCount = parseInt(likeMatch[1]);
                    console.log('✅ Extracted likes from caption:', data.likeCount);
                }
                
                const commentMatch = data.caption.match(/(\d+)\s+comments?/i);
                if (commentMatch) {
                    data.commentCount = parseInt(commentMatch[1]);
                    console.log('✅ Extracted comments from caption:', data.commentCount);
                }
            }
            
            // Extract author username from caption or full name
            if (!data.author.username) {
                // Try from caption like "2 likes, 0 comments - husseinbuilds on"
                const captionUsernameMatch = data.caption.match(/\s-\s+(\w+)\s+on/);
                if (captionUsernameMatch) {
                    data.author.username = captionUsernameMatch[1];
                    console.log('✅ Extracted username from caption:', data.author.username);
                } else if (data.author.fullName) {
                    // Try to extract username from full name
                    const usernameMatch = data.author.fullName.match(/^([^\s|]+)/);
                    if (usernameMatch) {
                        data.author.username = usernameMatch[1];
                        console.log('✅ Extracted username from author:', data.author.username);
                    }
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
            console.log('📜 Total script tags found:', allScripts.length);
            let metricsFound = false;
            let scriptsWithData = 0;
            
            for (const script of allScripts) {
                const text = script.textContent;
                if (text.includes('video_view_count') || text.includes('play_count')) {
                    scriptsWithData++;
                    console.log('🎯 Found script with metrics data');
                    try {
                        // Try to extract view count
                        const viewMatch = text.match(/"video_view_count":(\d+)/);
                        if (viewMatch) {
                            data.viewCount = parseInt(viewMatch[1]);
                            console.log('✅ View count:', data.viewCount);
                            metricsFound = true;
                        }
                        
                        // Try to extract like count
                        const likeMatch = text.match(/"like_count":(\d+)/);
                        if (likeMatch) {
                            data.likeCount = parseInt(likeMatch[1]);
                            console.log('✅ Like count:', data.likeCount);
                        }
                        
                        // Try to extract comment count
                        const commentMatch = text.match(/"comment_count":(\d+)/);
                        if (commentMatch) {
                            data.commentCount = parseInt(commentMatch[1]);
                            console.log('✅ Comment count:', data.commentCount);
                        }
                        
                        if (metricsFound) break;
                    } catch (e) {
                        console.log('❌ Error parsing metrics:', e.message);
                    }
                }
            }
            
            console.log('📊 Scripts with potential data:', scriptsWithData);
            if (!metricsFound) {
                console.log('⚠️ No metrics found in script tags, trying text patterns...');
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

        // Debug output
        console.log('\n📊 EXTRACTION RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📝 Caption: ${reelData.caption ? reelData.caption.substring(0, 100) + '...' : 'NOT FOUND'}`);
        console.log(`🎬 Video URL: ${reelData.videoUrl ? 'FOUND ✅' : 'NOT FOUND ❌'}`);
        console.log(`👁️  Views: ${reelData.viewCount || 'NOT FOUND'}`);
        console.log(`❤️  Likes: ${reelData.likeCount || 'NOT FOUND'}`);
        console.log(`💬 Comments: ${reelData.commentCount || 'NOT FOUND'}`);
        console.log(`👤 Author: ${reelData.author?.username || 'NOT FOUND'}`);
        console.log(`🏷️  Hashtags: ${reelData.hashtags?.length || 0} found`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (!reelData.caption && !reelData.videoUrl && reelData.viewCount === 0) {
            console.log('⚠️ WARNING: NO DATA EXTRACTED - Likely login wall or blocked by Instagram');
        }

        return reelData;

    } catch (error) {
        console.log(`❌ Scraping error: ${error.message}`);
        throw error;
    } finally {
        if (context) await context.close();
        if (browser) await browser.close();
    }
}

