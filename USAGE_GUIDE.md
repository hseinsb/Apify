# Usage Guide - Instagram Content Intelligence Pro

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configure Input

Edit `INPUT.json` with your Instagram Reel URLs and API keys:

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/YOUR_REEL_ID/"
  ],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "sk-your-key-here",
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

### 3. Run Locally

```bash
npm start
```

## Detailed Configuration

### Input Parameters

#### `reelUrls` (Required)
Array of Instagram Reel URLs to process.

**Example:**
```json
"reelUrls": [
  "https://www.instagram.com/reel/ABC123/",
  "https://www.instagram.com/reel/DEF456/"
]
```

#### `includeTranscript` (Optional, default: `true`)
Whether to extract speech-to-text transcript.

**Note:** Transcription requires:
- Video download
- Audio extraction (requires ffmpeg)
- API call to transcription service

#### `transcriptionService` (Optional, default: `"openai"`)
Choose between:
- `"openai"` - OpenAI Whisper API (faster, more accurate)
- `"assemblyai"` - AssemblyAI API (good alternative)

#### `openaiApiKey` (Conditional)
Your OpenAI API key. Required if `transcriptionService` is `"openai"`.

Get your key: https://platform.openai.com/api-keys

**Cost:** ~$0.006 per minute of audio

#### `assemblyaiApiKey` (Conditional)
Your AssemblyAI API key. Required if `transcriptionService` is `"assemblyai"`.

Get your key: https://www.assemblyai.com

#### `proxy` (Recommended)
Proxy configuration to avoid Instagram blocking.

**Apify Proxy (Recommended):**
```json
"proxy": {
  "useApifyProxy": true,
  "apifyProxyGroups": ["RESIDENTIAL"]
}
```

**Custom Proxy:**
```json
"proxy": {
  "proxyUrls": ["http://proxy.example.com:8080"]
}
```

## Output Format

The actor outputs JSON for each reel:

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "caption": "Check out this amazing content! #viral #trending",
  "hashtags": ["#viral", "#trending"],
  "transcript": "Hello everyone, welcome to my channel. Today I want to show you...",
  "viewCount": 125000,
  "likeCount": 5430,
  "commentCount": 234,
  "videoUrl": "https://scontent.cdninstagram.com/...",
  "author": {
    "username": "example_user",
    "fullName": "Example User"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "success": true
}
```

## System Requirements

### Local Development

1. **Node.js** 18+ 
2. **ffmpeg** (for audio extraction)
   - macOS: `brew install ffmpeg`
   - Ubuntu: `apt-get install ffmpeg`
   - Windows: Download from https://ffmpeg.org

3. **Disk Space**
   - Temporary storage for video/audio files
   - Cleaned up automatically after processing

### Apify Platform

All requirements are pre-installed in the Docker container.

## Troubleshooting

### Instagram Blocking Requests

**Symptom:** Scraping fails, empty data returned

**Solutions:**
1. Use residential proxies (Apify Proxy recommended)
2. Add delays between requests for bulk processing
3. Rotate proxies if making many requests

### Transcription Fails

**Symptom:** Error during transcription step

**Common Causes:**
1. Invalid API key
2. API quota exceeded
3. Audio file too large or corrupted
4. No speech detected in video

**Solutions:**
- Verify API key is correct
- Check API quota/billing
- Try alternative transcription service
- Set `includeTranscript: false` to skip transcription

### Video Download Fails

**Symptom:** Cannot download video

**Common Causes:**
1. Video URL expired or changed
2. Private account
3. Network issues

**Solutions:**
- Use fresh proxy
- Verify reel is publicly accessible
- Check network connectivity

### ffmpeg Not Found

**Symptom:** "ffmpeg is not installed" error

**Solution:**
Install ffmpeg on your system (see System Requirements above)

## Best Practices

### 1. Bulk Processing

For processing many reels:
- Use residential proxies
- Monitor API costs
- Consider rate limiting

### 2. API Key Security

- Never commit API keys to version control
- Use Apify secrets for production
- Rotate keys regularly

### 3. Cost Optimization

**Reduce costs by:**
- Disabling transcription when not needed
- Using lower quality audio extraction
- Batch processing during off-peak hours

**Cost breakdown per reel:**
- Apify compute: ~0.02-0.05 credits
- Transcription (1 min video): ~$0.006
- Proxy: ~$0.001-0.01 per request

### 4. Data Quality

**Improve data quality:**
- Use fresh, public reel URLs
- Enable residential proxies
- Verify output data completeness

## Advanced Usage

### Custom Audio Settings

Modify `src/utils.js` to adjust audio extraction:

```javascript
// Higher quality audio (larger file, better transcription)
const command = `ffmpeg -i "${videoPath}" -vn -ar 48000 -ac 2 -ab 192k -f mp3 "${audioPath}" -y`;
```

### Multiple Language Support

Modify transcription calls to support other languages:

```javascript
// In src/transcription.js
language: 'es', // Spanish
language: 'fr', // French
// etc.
```

### Custom Scrapers

For different Instagram content types, modify `src/scraper.js`:
- Posts
- Stories
- IGTV
- Profile data

## Support

For issues, questions, or feature requests:
1. Check this guide first
2. Review error logs
3. Contact support with:
   - Error message
   - Input configuration (without API keys)
   - Run ID (if on Apify platform)

## Updates

Check for updates regularly:
- Bug fixes
- Instagram API changes
- New features
- Performance improvements

