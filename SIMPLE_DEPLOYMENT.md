# 🚀 Simple Deployment Guide - Embed Your API Keys

## ✅ What Users Will See

Users only need to input **Instagram Reel URLs**. That's it! 

No API keys, no complicated setup. Just URLs ✨

---

## 📝 Step-by-Step Deployment

### Step 1: Deploy the Actor

```bash
# Install Apify CLI (if not installed)
npm install -g apify-cli

# Login to Apify
apify login
# Enter: [YOUR_APIFY_TOKEN_HERE]

# Deploy
cd "/Users/husseinsbeiti/Desktop/Apify Actor"
apify push
```

---

### Step 2: Set Your API Keys as Secrets

After deployment, go to Apify Console:

1. **Go to:** https://console.apify.com/actors
2. **Click** your actor: `instagram-content-intelligence-pro`
3. **Go to:** Settings → Environment Variables
4. **Add these secrets:**

```
Name: OPENAI_API_KEY
Value: [YOUR_OPENAI_API_KEY_HERE]
☑ Secret (check this box!)
```

```
Name: ASSEMBLYAI_API_KEY
Value: [YOUR_ASSEMBLYAI_API_KEY_HERE]
☑ Secret (check this box!)
```

5. **Click** "Save"

---

## ✨ What Users Experience

### Simple Input Form:

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/ABC123/",
    "https://www.instagram.com/reel/DEF456/"
  ],
  "includeTranscript": true
}
```

That's it! No API keys needed from them.

---

## 💰 How to Charge Users

### Option 1: Per-Run Pricing (Recommended)

Set a price for each actor run in Apify Console:

1. Go to your actor → **Settings** → **Publication**
2. Set **"Price per run"**: e.g., $0.10, $0.50, $1.00
3. Users pay automatically when they run your actor

### Option 2: Subscription Model

Offer monthly plans:
- Basic: $10/month - 100 reels
- Pro: $50/month - 1000 reels
- Enterprise: Custom pricing

(Requires custom billing outside Apify)

### Cost Breakdown:

**Your costs per reel:**
- Transcription: ~$0.006 (1 min video)
- Apify compute: ~$0.003
- Proxy: ~$0.01
- **Total: ~$0.019 per reel**

**Suggested pricing:**
- Charge $0.10 per reel (5x markup = 400% profit)
- Or $0.50 per run (covers multiple reels)

---

## 🔐 Your API Keys Are Safe

✅ Stored as encrypted environment variables in Apify  
✅ Never visible in logs or outputs  
✅ Never exposed to users  
✅ Only accessible to your actor during runtime  

---

## 🎯 User Flow

1. User finds your actor on Apify
2. User inputs Instagram Reel URLs
3. User clicks "Start"
4. User pays (per your pricing)
5. Actor runs using YOUR API keys
6. User gets results!

**Super simple! 🎉**

---

## 📊 Testing After Deployment

### Test Run:

1. Go to your actor page
2. Click "Try for free" (or "Start")
3. Enter test input:

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/C8aT7zXyGBE/"
  ],
  "includeTranscript": true
}
```

4. Click "Start"
5. Check results in the Dataset tab

---

## 🛠️ Publishing Your Actor

### Make it Public:

1. Go to Settings → **Publication**
2. Set **Visibility**: Public
3. Add **Title**: "Instagram Content Intelligence Pro"
4. Add **Description**: 
   > Extract complete intelligence from Instagram Reels including transcripts, captions, hashtags, engagement metrics, and video URLs. No API keys needed!

5. Add **Categories**: Social Media, Data Extraction
6. Set **Price per run**: (e.g., $0.10)
7. Click **"Publish to Apify Store"**

---

## 💡 Marketing Your Actor

### Key Selling Points:

✅ **No setup required** - Just paste Instagram URLs  
✅ **Full transcription** - Speech-to-text included  
✅ **Complete data** - Caption, hashtags, views, likes, comments  
✅ **Bulk processing** - Multiple reels at once  
✅ **Direct video URLs** - Download links included  

### Target Users:

- 📊 Social media marketers
- 🎬 Content creators
- 🔍 Researchers
- 📈 Analytics agencies
- 💼 Social media managers

---

## 📈 Monitoring Usage & Costs

### Track Your Costs:

1. **OpenAI Dashboard**: https://platform.openai.com/usage
   - Monitor transcription usage
   - Set spending limits

2. **Apify Dashboard**: https://console.apify.com/billing
   - Monitor compute usage
   - Track proxy costs

3. **Actor Runs**: https://console.apify.com/actors/[YOUR_ACTOR]/runs
   - See how many times users run it
   - Calculate profit per run

---

## 🎉 You're Ready!

**Deploy commands:**

```bash
apify login
cd "/Users/husseinsbeiti/Desktop/Apify Actor"
apify push
```

**Then:**
1. Set environment variables (OPENAI_API_KEY, ASSEMBLYAI_API_KEY)
2. Test with a sample reel
3. Set your pricing
4. Publish to Apify Store
5. Start earning! 💰

---

## 🆘 Troubleshooting

### "Transcription API keys not configured"
→ Make sure you added OPENAI_API_KEY or ASSEMBLYAI_API_KEY as environment variables

### "No results"
→ Test with a known public reel URL

### High costs?
→ Set usage alerts in OpenAI dashboard
→ Consider disabling transcription for free tier

---

**Your actor is ready to make money! 🚀**

