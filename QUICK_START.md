# 🚀 Quick Start Guide

## What You Have

A complete, production-ready Apify actor that extracts intelligence from Instagram Reels:

- 📝 Caption & Hashtags
- 🎤 Speech-to-text Transcript
- 📊 Engagement Metrics (views, likes, comments)
- 🎬 Direct Video URLs
- 👤 Author Information
- 🔄 Bulk Processing Support

## Installation

```bash
cd "/Users/husseinsbeiti/Desktop/Apify Actor"
npm install
```

## Quick Test

1. **Edit INPUT.json:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/YOUR_REEL_ID/"
  ],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "sk-YOUR_KEY_HERE"
}
```

2. **Run:**

```bash
npm start
```

3. **Check Output:**

Results will be in `apify_storage/datasets/default/`

## Deploy to Apify

### Option 1: Using Apify CLI

```bash
# Install Apify CLI
npm install -g apify-cli

# Login
apify login

# Push to Apify
apify push
```

### Option 2: Manual Upload

1. Zip the project folder
2. Go to Apify Console
3. Create new Actor
4. Upload zip file
5. Configure input schema
6. Add API keys in secrets

## What Each File Does

| File | Purpose |
|------|---------|
| `src/main.js` | Main orchestrator - handles workflow |
| `src/scraper.js` | Scrapes Instagram using Playwright |
| `src/transcription.js` | Converts speech to text |
| `src/utils.js` | Helper functions (download, audio extraction) |
| `.actor/actor.json` | Apify actor configuration |
| `.actor/input_schema.json` | Defines input parameters |
| `INPUT.json` | Example input for testing |
| `Dockerfile` | Docker build configuration |

## Required API Keys

### OpenAI (Recommended)
- Get from: https://platform.openai.com/api-keys
- Cost: ~$0.006 per minute of audio
- Fastest and most accurate

### AssemblyAI (Alternative)
- Get from: https://www.assemblyai.com
- Good alternative to OpenAI
- Free tier available

## Common Commands

```bash
# Install dependencies
npm install

# Run locally
npm start

# Test without transcription
# (Edit INPUT.json: "includeTranscript": false)
npm start
```

## System Requirements

### For Local Development
- Node.js 18+
- ffmpeg (`brew install ffmpeg` on macOS)
- At least 2GB RAM
- Internet connection

### For Apify Platform
- Everything is pre-configured in Docker
- No additional setup needed

## Example Output

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "caption": "Check out this amazing video! 🔥 #viral #trending",
  "hashtags": ["#viral", "#trending"],
  "transcript": "Hello everyone, welcome back to my channel...",
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

## Troubleshooting

### "ffmpeg not found"
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org
```

### Instagram blocking requests
- Use Apify Residential Proxy in your input config
- Don't process too many reels too quickly

### Transcription fails
- Verify your API key is correct
- Check your API credits/quota
- Try the alternative service

### Video download fails
- Make sure the reel is public
- Try using a proxy
- Check if the URL is correct

## Cost Estimate

**Per 1-minute reel with transcription:**
- Apify compute: ~0.03 credits (~$0.003)
- Transcription: ~$0.006
- Proxy (if using residential): ~$0.01
- **Total: ~$0.019 per reel**

**Without transcription:**
- Apify compute: ~0.01 credits (~$0.001)
- Proxy: ~$0.01
- **Total: ~$0.011 per reel**

## Next Steps

1. ✅ Test locally with a public Instagram Reel
2. ✅ Verify output quality
3. ✅ Deploy to Apify platform
4. ✅ Process your real data
5. ✅ Monitor usage and costs

## Get Help

- **Detailed Documentation:** See `README.md`
- **Usage Guide:** See `USAGE_GUIDE.md`
- **Technical Details:** See `PROJECT_SUMMARY.md`

## Pro Tips

1. **Save costs:** Set `includeTranscript: false` when you don't need it
2. **Better results:** Always use residential proxies
3. **Bulk processing:** Process 10-20 reels at a time for efficiency
4. **Monitor output:** Check success rate and adjust configuration

---

**You're all set! 🎉**

Start by running a test with one reel, then scale up to bulk processing.

