# Instagram Content Intelligence Pro

Extract complete intelligence data from Instagram Reels including transcript, caption, hashtags, video URL, and engagement metrics.

## Features

- 🎬 **Video Metadata Extraction**: Caption, hashtags, view count, likes, and comments
- 🎤 **Speech-to-Text Transcription**: Extract complete transcript from video audio
- 📊 **Bulk Processing**: Process multiple Instagram Reels in a single run
- 🔗 **Direct Video URLs**: Get direct download links for videos
- 📦 **Structured JSON Output**: Clean, structured data for each reel

## Input

The actor accepts the following input parameters:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reelUrls` | Array | Yes | List of Instagram Reel URLs to analyze |
| `includeTranscript` | Boolean | No | Extract speech-to-text transcript (default: true) |
| `transcriptionService` | String | No | Choose 'openai' or 'assemblyai' (default: 'openai') |
| `openaiApiKey` | String | Conditional | Required if using OpenAI transcription |
| `assemblyaiApiKey` | String | Conditional | Required if using AssemblyAI transcription |
| `proxy` | Object | No | Proxy configuration for Instagram requests |

### Example Input

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/ABC123/",
    "https://www.instagram.com/reel/DEF456/"
  ],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "sk-...",
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

## Output

The actor outputs structured JSON data for each reel:

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "caption": "Check out this amazing video! #viral #trending",
  "hashtags": ["#viral", "#trending"],
  "transcript": "Hello everyone, welcome to my channel...",
  "viewCount": 125000,
  "likeCount": 5430,
  "commentCount": 234,
  "videoUrl": "https://scontent.cdninstagram.com/...",
  "author": {
    "username": "example_user",
    "fullName": "Example User"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Setup & Requirements

### API Keys

You'll need an API key for transcription services:

- **OpenAI**: Get your API key from [platform.openai.com](https://platform.openai.com)
- **AssemblyAI**: Get your API key from [assemblyai.com](https://www.assemblyai.com)

### Proxy

Instagram has anti-scraping measures. It's recommended to use:
- Apify Residential Proxy (recommended)
- Your own proxy service

## Usage

### On Apify Platform

1. Add your Instagram Reel URLs
2. Configure transcription service and API key
3. Set up proxy configuration
4. Run the actor

### Locally

```bash
npm install
npm start
```

## Limitations

- Instagram may block requests without proper proxy configuration
- Transcription accuracy depends on audio quality
- Private accounts cannot be accessed
- Rate limiting may apply for bulk processing

## Cost Considerations

- **Apify Compute Units**: Depends on number of reels and processing time
- **Transcription API**: 
  - OpenAI Whisper: ~$0.006 per minute of audio
  - AssemblyAI: Varies by plan
- **Proxy**: Residential proxy usage costs

## Support

For issues or questions, please contact support or create an issue in the repository.

## License

Apache-2.0

