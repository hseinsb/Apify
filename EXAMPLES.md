# 📚 Example Use Cases & Configurations

## Use Case 1: Content Analysis for Marketing

**Scenario:** Analyze competitor's top-performing Instagram Reels to understand their content strategy.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/CompetitorReel1/",
    "https://www.instagram.com/reel/CompetitorReel2/",
    "https://www.instagram.com/reel/CompetitorReel3/",
    "https://www.instagram.com/reel/CompetitorReel4/",
    "https://www.instagram.com/reel/CompetitorReel5/"
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

**What You Get:**
- Full transcripts to analyze messaging
- Hashtag patterns
- Engagement metrics to identify best performers
- Video URLs for further analysis

**Use the Data For:**
- Content strategy planning
- Trending topic identification
- Hashtag research
- Engagement benchmarking

---

## Use Case 2: Influencer Research

**Scenario:** Research influencer content before partnership.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/InfluencerReel1/",
    "https://www.instagram.com/reel/InfluencerReel2/",
    "https://www.instagram.com/reel/InfluencerReel3/"
  ],
  "includeTranscript": true,
  "transcriptionService": "assemblyai",
  "assemblyaiApiKey": "your-key",
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

**What You Get:**
- Speaking style and tone (from transcript)
- Content themes
- Average engagement rates
- Hashtag usage patterns

**Use the Data For:**
- Influencer vetting
- Brand alignment assessment
- Engagement rate calculation
- Content style analysis

---

## Use Case 3: Trend Monitoring

**Scenario:** Monitor trending reels in your industry daily.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/TrendingReel1/",
    "https://www.instagram.com/reel/TrendingReel2/",
    "https://www.instagram.com/reel/TrendingReel3/",
    "https://www.instagram.com/reel/TrendingReel4/",
    "https://www.instagram.com/reel/TrendingReel5/",
    "https://www.instagram.com/reel/TrendingReel6/",
    "https://www.instagram.com/reel/TrendingReel7/",
    "https://www.instagram.com/reel/TrendingReel8/",
    "https://www.instagram.com/reel/TrendingReel9/",
    "https://www.instagram.com/reel/TrendingReel10/"
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

**Automation Setup:**
- Schedule actor to run daily
- Export data to Google Sheets
- Set up trend alerts

**What You Track:**
- Emerging topics
- Popular hashtags
- Content formats
- Viral patterns

---

## Use Case 4: Content Archive & Backup

**Scenario:** Archive your own Instagram Reels with full metadata.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/YourReel1/",
    "https://www.instagram.com/reel/YourReel2/",
    "https://www.instagram.com/reel/YourReel3/"
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

**What You Archive:**
- Original captions
- Engagement snapshots
- Video files (via videoUrl)
- Full transcripts
- Performance data

**Benefits:**
- Portfolio documentation
- Performance tracking
- Content repurposing
- Platform-independent backup

---

## Use Case 5: Budget-Conscious Processing (No Transcription)

**Scenario:** Extract metadata only, skip transcription to save costs.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/Reel1/",
    "https://www.instagram.com/reel/Reel2/",
    "https://www.instagram.com/reel/Reel3/",
    "https://www.instagram.com/reel/Reel4/",
    "https://www.instagram.com/reel/Reel5/",
    "https://www.instagram.com/reel/Reel6/",
    "https://www.instagram.com/reel/Reel7/",
    "https://www.instagram.com/reel/Reel8/",
    "https://www.instagram.com/reel/Reel9/",
    "https://www.instagram.com/reel/Reel10/",
    "https://www.instagram.com/reel/Reel11/",
    "https://www.instagram.com/reel/Reel12/",
    "https://www.instagram.com/reel/Reel13/",
    "https://www.instagram.com/reel/Reel14/",
    "https://www.instagram.com/reel/Reel15/",
    "https://www.instagram.com/reel/Reel16/",
    "https://www.instagram.com/reel/Reel17/",
    "https://www.instagram.com/reel/Reel18/",
    "https://www.instagram.com/reel/Reel19/",
    "https://www.instagram.com/reel/Reel20/"
  ],
  "includeTranscript": false,
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

**Cost Savings:**
- No transcription API costs
- Faster processing
- Lower compute usage

**When to Use:**
- High-volume processing
- Metadata-only needs
- Budget constraints
- Quick scanning

---

## Use Case 6: Research Project (Academic/Market Research)

**Scenario:** Collect data for research on social media trends.

**Input Configuration:**

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/Sample1/",
    "https://www.instagram.com/reel/Sample2/",
    "https://www.instagram.com/reel/Sample3/",
    "https://www.instagram.com/reel/Sample4/",
    "https://www.instagram.com/reel/Sample5/",
    "https://www.instagram.com/reel/Sample6/",
    "https://www.instagram.com/reel/Sample7/",
    "https://www.instagram.com/reel/Sample8/",
    "https://www.instagram.com/reel/Sample9/",
    "https://www.instagram.com/reel/Sample10/"
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

**Research Applications:**
- Content analysis
- Linguistic studies
- Engagement pattern research
- Social media behavior studies

**Data Export:**
- CSV/JSON for analysis
- Integration with research tools
- Statistical analysis ready
- Qualitative coding support

---

## Sample Output Analysis

### Output Example:

```json
{
  "url": "https://www.instagram.com/reel/ABC123/",
  "caption": "Transform your mornings with this 5-minute routine! ☀️ #productivity #morningroutine #selfcare",
  "hashtags": ["#productivity", "#morningroutine", "#selfcare"],
  "transcript": "Good morning everyone! Today I want to share with you my five-minute morning routine that has completely transformed my life. First, I start with a glass of water. This helps wake up my body and get my metabolism going. Next, I do some light stretching for about two minutes. This helps me feel more energized and ready for the day. Then, I spend one minute on deep breathing exercises. This calms my mind and helps me focus. Finally, I write down three things I'm grateful for. This sets a positive tone for the entire day. Try it for a week and let me know how it goes!",
  "viewCount": 245000,
  "likeCount": 18500,
  "commentCount": 432,
  "videoUrl": "https://scontent.cdninstagram.com/v/...",
  "author": {
    "username": "wellness_coach",
    "fullName": "Sarah Johnson"
  },
  "timestamp": "2024-01-15T08:30:00.000Z",
  "success": true
}
```

### What You Can Analyze:

1. **Content Theme:** Morning routine, wellness, productivity
2. **Engagement Rate:** (18,500 / 245,000) = 7.55% (excellent!)
3. **Hashtag Strategy:** Broad + niche + lifestyle
4. **Transcript Insights:** 
   - Clear structure (numbered steps)
   - Call-to-action (try it for a week)
   - Personal approach (uses "I" and "my")
5. **Optimal Length:** ~90 seconds (based on transcript)

---

## Advanced Configuration Examples

### With Custom Proxy:

```json
{
  "reelUrls": ["https://www.instagram.com/reel/ABC123/"],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "sk-...",
  "proxy": {
    "useApifyProxy": false,
    "proxyUrls": ["http://username:password@proxy.example.com:8080"]
  }
}
```

### Minimal Configuration (Just URLs):

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/ABC123/"
  ],
  "includeTranscript": false
}
```

**Note:** Without proxy, may face Instagram blocking.

---

## Integration Examples

### Export to Google Sheets

After running the actor:

```javascript
// Use Apify's Google Sheets integration
// Or fetch via API:

const Apify = require('apify');
const client = Apify.newClient({ token: 'YOUR_API_TOKEN' });

const dataset = await client.dataset('YOUR_DATASET_ID').listItems();
// Process and send to Google Sheets
```

### Webhook Integration

Set up webhook in Apify to trigger on completion:

```json
{
  "webhookUrl": "https://your-app.com/webhook",
  "method": "POST",
  "payload": {
    "datasetId": "{{datasetId}}",
    "status": "{{status}}"
  }
}
```

### Schedule Regular Runs

In Apify Console:
1. Go to your actor
2. Click "Schedule"
3. Set frequency (daily, weekly, etc.)
4. Configure input for scheduled runs

---

## Performance Tips by Use Case

### High-Volume Processing (50+ URLs)
- Disable transcription initially
- Use residential proxies
- Process in batches
- Monitor quota limits

### High-Accuracy Needs
- Enable transcription
- Use OpenAI (more accurate)
- Verify output manually
- Use high-quality proxies

### Cost-Sensitive Projects
- Disable transcription
- Process fewer URLs per run
- Use cheaper proxy options
- Schedule during off-peak

### Time-Sensitive Projects
- Use OpenAI (faster)
- Enable parallel processing
- Use premium proxies
- Skip error retries

---

## Common Workflows

### Daily Monitoring Workflow

1. **Morning:** Run actor with trending reels
2. **Export:** Download CSV from Apify dataset
3. **Analyze:** Import to analytics tool
4. **Report:** Generate insights dashboard
5. **Action:** Adjust content strategy

### Competitor Analysis Workflow

1. **Identify:** List competitor reel URLs
2. **Extract:** Run actor with full transcription
3. **Analyze:** Study patterns and themes
4. **Compare:** Benchmark against your content
5. **Optimize:** Apply learnings

### Content Research Workflow

1. **Search:** Find relevant reels manually
2. **Collect:** Compile URL list
3. **Extract:** Run actor
4. **Categorize:** Tag and organize data
5. **Create:** Use insights for content creation

---

## Success Metrics to Track

From the extracted data, you can calculate:

1. **Engagement Rate:** `(likes + comments) / views * 100`
2. **Virality Score:** `views / follower_count` (if you have follower data)
3. **Hashtag Performance:** Average engagement by hashtag
4. **Content Length Impact:** Transcript length vs engagement
5. **Posting Time Analysis:** Timestamp vs engagement

---

Need help with a specific use case? Check the other documentation files or contact support!

