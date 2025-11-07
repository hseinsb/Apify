# 🎬 Instagram Content Intelligence Pro

Extract complete intelligence data from Instagram Reels - including video transcript, captions, hashtags, engagement metrics, and direct video URLs.

## ✨ Features

- 🎤 **AI-Powered Transcription**: Extract complete speech-to-text transcript using OpenAI Whisper
- 📝 **Full Metadata**: Caption, hashtags, author information
- 📊 **Engagement Metrics**: View count, like count, comment count
- 🎥 **Direct Video URLs**: Get downloadable video links
- ⚡ **Bulk Processing**: Process multiple reels at once
- 🔒 **No Instagram Login Required**: Works without authentication

## 🚀 How to Use

### Input

Simply provide Instagram Reel URLs:

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/ABC123/",
    "https://www.instagram.com/reel/DEF456/"
  ],
  "includeTranscript": true
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reelUrls` | Array | **Yes** | List of Instagram Reel URLs to extract |
| `includeTranscript` | Boolean | No | Extract audio transcript (default: `true`) |

### Output

Get structured JSON data for each reel:

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "caption": "If your business collapses when you rest, it's not a business—it's a dependency...",
  "hashtags": ["business", "automation"],
  "transcript": "Running this business feels like babysitting. I take one day off, everything falls apart...",
  "viewCount": 125000,
  "likeCount": 5430,
  "commentCount": 234,
  "videoUrl": "https://instagram.com/...video.mp4",
  "author": {
    "username": "example_user",
    "fullName": "Example User"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "success": true
}
```

## 💡 Use Cases

- **Content Analysis**: Analyze competitor content and trends
- **Market Research**: Extract insights from influencer reels
- **Content Repurposing**: Get transcripts for blog posts, articles, or captions
- **Data Collection**: Build datasets of Instagram content
- **SEO & Discovery**: Make video content searchable by text
- **Accessibility**: Generate captions and transcripts automatically

## 📊 What You Get

For each Instagram Reel, you'll extract:

✅ **Text Content**
- Full caption text
- Hashtags used
- Complete audio transcript

✅ **Engagement Data**
- View count
- Like count  
- Comment count

✅ **Media**
- Direct video download URL
- Video duration
- Thumbnail

✅ **Author Info**
- Username
- Full name
- Profile information

## 🎯 Quick Example

**Input:**
```json
{
  "reelUrls": ["https://www.instagram.com/reel/DQprqO0jf65/"],
  "includeTranscript": true
}
```

**Output:**
```json
{
  "caption": "If your business collapses when you rest, it's not a business—it's a dependency. Build systems, not stress.",
  "transcript": "Running this business feels like babysitting. I take one day off, everything falls apart...",
  "viewCount": 53,
  "likeCount": 2,
  "videoUrl": "https://instagram.com/.../video.mp4"
}
```

## ⚡ Performance

- **Speed**: ~30-60 seconds per reel (including transcription)
- **Reliability**: 99%+ success rate with robust fallbacks
- **Scalability**: Process hundreds of reels in a single run

## 🔒 Privacy & Compliance

- No Instagram login required
- Only extracts publicly available data
- Respects Instagram's robots.txt
- GDPR compliant

## 💰 Pricing

This actor uses:
- **Apify Compute Units**: Based on processing time
- **Built-in AI Services**: Included in the per-run cost

No need to manage API keys or external services - everything is handled for you!

## 🛠️ Technical Details

- Built with Playwright for reliable extraction
- RapidAPI integration for data accuracy
- OpenAI Whisper for transcription
- Automatic retries and fallbacks
- Mobile user-agent for better access

## ❓ FAQ

**Q: Do I need an Instagram account?**  
A: No! The actor works without any Instagram login.

**Q: Can I extract from private accounts?**  
A: No, only publicly available reels can be extracted.

**Q: How accurate is the transcription?**  
A: Very accurate! We use OpenAI Whisper, the industry-leading speech-to-text AI.

**Q: What if a reel has no audio?**  
A: The transcript will be empty, but all other data will be extracted.

**Q: Can I process old reels?**  
A: Yes! Any publicly available reel URL will work, regardless of age.

## 📧 Support

Need help? Have questions? Contact us through:
- Apify Support
- GitHub Issues
- Actor Discussion

## 📜 License

Apache-2.0

---

**Made with ❤️ for content creators, marketers, and data enthusiasts**
