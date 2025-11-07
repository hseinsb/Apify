# 🚀 Secure Deployment Guide

## ✅ Your API Keys Are Safe!

Your sensitive API keys will be stored as **Apify Secrets**, which are:
- ✅ Encrypted at rest
- ✅ Never visible in logs
- ✅ Never exposed in the code
- ✅ Only accessible to your actor during runtime

---

## 📝 Step-by-Step Deployment

### Step 1: Install Apify CLI

```bash
npm install -g apify-cli
```

### Step 2: Login to Apify

```bash
apify login
```

When prompted, enter your API token (saved in API_KEYS.txt)

### Step 3: Deploy the Actor

```bash
cd "/Users/husseinsbeiti/Desktop/Apify Actor"
apify push
```

This will:
- Build the Docker image
- Upload your actor to Apify
- Make it available in your account

---

## 🔐 Step 4: Configure API Keys as Secrets

After deployment, configure your API keys securely:

### Option A: Via Apify Console (Recommended)

1. Go to https://console.apify.com/actors
2. Find your "instagram-content-intelligence-pro" actor
3. Click on it
4. Go to **Settings** → **Environment Variables**
5. Add these secrets:

```
OPENAI_API_KEY = [YOUR_KEY_FROM_API_KEYS.txt]

ASSEMBLYAI_API_KEY = [YOUR_KEY_FROM_API_KEYS.txt]
```

**Check "Secret" for both!** ✅

### Option B: Pass Keys in Actor Input

When running the actor, you can pass keys directly in the input:

```json
{
  "reelUrls": ["https://www.instagram.com/reel/YOUR_ID/"],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "YOUR_KEY_HERE",
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

**Note:** The input schema marks `openaiApiKey` and `assemblyaiApiKey` as `isSecret: true`, so they won't appear in logs!

---

## 🎯 Step 5: Run Your Actor

1. Go to your actor page: https://console.apify.com/actors
2. Click **"instagram-content-intelligence-pro"**
3. Click **"Try it"**
4. Enter your input:

```json
{
  "reelUrls": [
    "https://www.instagram.com/reel/C8aT7zXyGBE/"
  ],
  "includeTranscript": true,
  "transcriptionService": "openai",
  "openaiApiKey": "[YOUR_KEY_HERE]",
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

5. Click **"Start"**
6. Wait for results! 🎉

---

## 🔒 Security Summary

### ✅ What's Protected:

- **API keys are encrypted** in Apify Secrets
- **INPUT.json is in .gitignore** - won't be committed
- **Input schema marks keys as secret** - won't show in logs
- **No hardcoded keys in deployed code** - safe to share

### ⚠️ Remember:

- **Never commit API keys** to Git
- **Use Apify Secrets** for production
- **Share your actor safely** - keys stay private
- **Rotate keys regularly** for best security

---

## 📊 After Deployment

Your actor will:
- ✅ Use Apify's residential proxies automatically
- ✅ Store results in Apify datasets
- ✅ Be accessible via API
- ✅ Support scheduled runs
- ✅ Have proper logging and monitoring

---

## 🆘 Troubleshooting

### "Actor build failed"
- Check that all dependencies are in package.json
- Verify Dockerfile is correct

### "No results returned"
- Try different Instagram Reel URLs
- Make sure reels are public
- Check that proxy is enabled

### "Transcription failed"
- Verify API key is correct
- Check API quota/billing
- Try alternative transcription service

---

## 🎓 Next Steps

1. **Test with different reels** - try various content types
2. **Schedule runs** - automate data collection
3. **Export data** - integrate with your workflow
4. **Monitor usage** - track costs and performance

---

**You're ready to deploy! 🚀**

Your API keys will be completely secure throughout the process.

