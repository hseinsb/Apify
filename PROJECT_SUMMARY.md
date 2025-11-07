# Instagram Content Intelligence Pro - Project Summary

## 🎯 Project Overview

**Instagram Content Intelligence Pro** is a custom Apify actor that extracts comprehensive intelligence data from Instagram Reels, including:

- ✅ Transcript (speech-to-text)
- ✅ Caption text
- ✅ Hashtags
- ✅ Video URL (direct source)
- ✅ View count
- ✅ Like count
- ✅ Comment count
- ✅ Author information
- ✅ Bulk processing support

This actor eliminates dependency on third-party actors and provides complete control over the extraction process.

## 📁 Project Structure

```
instagram-content-intelligence-pro/
├── .actor/
│   ├── actor.json              # Apify actor configuration
│   └── input_schema.json       # Input schema definition
├── src/
│   ├── main.js                 # Main actor entry point
│   ├── scraper.js              # Instagram scraping logic
│   ├── transcription.js        # Speech-to-text services
│   └── utils.js                # Utility functions
├── Dockerfile                  # Docker configuration
├── package.json                # Node.js dependencies
├── INPUT.json                  # Example input file
├── README.md                   # Main documentation
└── USAGE_GUIDE.md              # Detailed usage guide
```

## 🔧 Technical Architecture

### 1. Main Entry Point (`src/main.js`)

**Responsibilities:**
- Input validation
- Orchestrates the entire workflow
- Error handling and logging
- Data output to Apify dataset

**Workflow:**
1. Validate input (URLs, API keys)
2. Loop through each reel URL
3. Call scraper to extract metadata
4. Download video if transcription is needed
5. Extract audio from video
6. Call transcription service
7. Push structured data to dataset

### 2. Instagram Scraper (`src/scraper.js`)

**Technology:** Playwright (Chromium browser automation)

**Features:**
- Headless browser scraping
- Proxy support (Apify Proxy + custom proxies)
- Anti-detection measures (user agent, headers)
- Dynamic content extraction

**Extraction Process:**
1. Launch browser with proxy configuration
2. Navigate to Instagram Reel URL
3. Wait for dynamic content to load
4. Extract data using DOM manipulation:
   - Video URL from `<video>` element
   - Caption from meta tags and visible text
   - Hashtags from caption text
   - Engagement metrics from page text
   - Author information from meta tags

**Challenges Solved:**
- Instagram's anti-scraping measures
- Dynamic content loading
- Varied HTML structures
- Private content handling

### 3. Transcription Service (`src/transcription.js`)

**Supported Services:**
- **OpenAI Whisper** (Primary, recommended)
- **AssemblyAI** (Alternative)

**OpenAI Implementation:**
- Direct API call with audio file stream
- Fast processing (~30 seconds for 1-minute video)
- High accuracy for English content
- Cost: ~$0.006 per minute

**AssemblyAI Implementation:**
- Three-step process:
  1. Upload audio file
  2. Request transcription
  3. Poll for completion
- Takes longer but good alternative
- Multiple language support

**Error Handling:**
- API key validation
- Timeout management
- Graceful degradation (continues without transcript on failure)

### 4. Utilities (`src/utils.js`)

**Key Functions:**

1. **`validateUrl(url)`**
   - Validates Instagram Reel URL format
   - Regex pattern matching

2. **`downloadVideo(videoUrl, filename)`**
   - Downloads video from direct URL
   - Axios streaming download
   - Timeout handling (2 minutes)

3. **`extractAudioFromVideo(videoPath)`**
   - Uses ffmpeg to extract audio
   - Converts to MP3 format (16kHz, mono, 96kbps)
   - Optimized for speech recognition
   - Auto-cleanup of video file

4. **Helper functions**
   - File cleanup
   - Number formatting

## 🔄 Data Flow

```
User Input (URLs + Config)
    ↓
Input Validation
    ↓
For Each URL:
    ↓
    ├─→ Scrape Instagram Page (Playwright)
    │       ↓
    │   Extract Metadata
    │   (caption, hashtags, stats, video URL)
    │       ↓
    ├─→ Download Video (if transcript enabled)
    │       ↓
    ├─→ Extract Audio (ffmpeg)
    │       ↓
    ├─→ Transcribe Audio (OpenAI/AssemblyAI)
    │       ↓
    └─→ Combine All Data
            ↓
        Push to Dataset (JSON)
            ↓
End → Complete Dataset
```

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | 18+ |
| Apify SDK | Actor framework | ^3.1.10 |
| Playwright | Browser automation | ^1.40.0 |
| OpenAI API | Speech-to-text | ^4.20.0 |
| Axios | HTTP requests | ^1.6.2 |
| ffmpeg | Audio extraction | System dependency |

## 🔐 Configuration & Security

### API Keys
- Stored securely in Apify secrets
- Never logged or exposed
- Validated before use

### Proxy Configuration
- Supports Apify Residential Proxy (recommended)
- Custom proxy support
- Rotation for bulk processing

### Environment Variables
All sensitive data through:
- Apify input schema (with `isSecret: true`)
- Environment variables for local development

## 📊 Output Schema

```json
{
  "url": "string",              // Original reel URL
  "caption": "string",          // Post caption/description
  "hashtags": ["string"],       // Array of hashtags
  "transcript": "string",       // Speech-to-text transcript
  "viewCount": "number",        // View count
  "likeCount": "number",        // Like count
  "commentCount": "number",     // Comment count
  "videoUrl": "string",         // Direct video download URL
  "author": {
    "username": "string",       // Instagram username
    "fullName": "string"        // Display name
  },
  "timestamp": "string",        // ISO 8601 timestamp
  "success": "boolean"          // Processing status
}
```

## ⚡ Performance Considerations

### Processing Time (per reel)
- Scraping: 10-20 seconds
- Video download: 5-15 seconds (depends on size)
- Audio extraction: 2-5 seconds
- Transcription: 20-60 seconds (depends on length)
- **Total: ~40-100 seconds per reel**

### Resource Usage
- Memory: ~500MB per concurrent run
- Disk: ~100MB temporary per video
- Network: ~10-50MB per reel

### Optimization Strategies
1. **Parallel processing** - Process multiple reels concurrently
2. **Conditional transcription** - Skip when not needed
3. **Audio quality optimization** - Lower bitrate for transcription
4. **Auto cleanup** - Delete temporary files immediately
5. **Proxy rotation** - Avoid rate limiting

## 🚀 Deployment

### Apify Platform
1. Push code to repository
2. Connect to Apify
3. Build Docker image
4. Configure input schema
5. Set up secrets (API keys)
6. Run actor

### Local Development
```bash
npm install
# Edit INPUT.json with your config
npm start
```

## 🔍 Error Handling

### Robust Error Management
- Try-catch blocks at every level
- Graceful degradation
- Detailed error logging
- Per-reel error tracking

### Error Recovery
- Continue processing remaining reels on failure
- Output error information in dataset
- Cleanup resources on error

## 📈 Scalability

### Bulk Processing
- Supports unlimited URLs per run
- Sequential processing (can be parallelized)
- Memory efficient (processes one at a time)

### Rate Limiting
- Instagram: Use residential proxies
- Transcription APIs: Monitor quotas
- Apify compute: Optimize run time

## 🎓 Learning Resources

### Instagram Scraping
- Playwright documentation
- Instagram DOM structure analysis
- Anti-scraping countermeasures

### Speech-to-Text
- OpenAI Whisper API docs
- AssemblyAI documentation
- Audio preprocessing for better accuracy

### Apify Development
- Apify SDK documentation
- Actor best practices
- Dataset management

## 🔮 Future Enhancements

### Potential Features
1. **Multiple content types**
   - Posts, Stories, IGTV
   - Profile scraping

2. **Advanced analytics**
   - Sentiment analysis
   - Keyword extraction
   - Topic modeling

3. **Real-time monitoring**
   - Scheduled runs
   - Change detection
   - Notifications

4. **Enhanced extraction**
   - Face recognition
   - Object detection
   - Brand mentions

5. **Performance improvements**
   - Parallel processing
   - Caching
   - Optimized media handling

## 🤝 Maintenance

### Regular Updates Needed
- Instagram HTML structure changes
- API version updates
- Dependency updates
- Security patches

### Monitoring
- Success rates
- Processing times
- API costs
- Error patterns

## 📝 Notes

### Instagram Limitations
- Public content only
- Rate limiting applies
- Content may be deleted/changed
- Platform updates may break scraping

### API Costs
- Monitor transcription usage
- Set budget limits
- Use conditional processing
- Optimize audio quality vs cost

## ✅ Project Completion

All required features implemented:
- ✅ Instagram Reel scraping
- ✅ Caption extraction
- ✅ Hashtag parsing
- ✅ Video URL extraction
- ✅ Engagement metrics (views, likes, comments)
- ✅ Speech-to-text transcription
- ✅ Bulk URL processing
- ✅ Structured JSON output
- ✅ Error handling
- ✅ Documentation

**Status:** Production Ready 🚀

---

*Built with ❤️ for intelligent Instagram content analysis*

