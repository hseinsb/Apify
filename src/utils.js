import { Actor } from 'apify';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

/**
 * Validate if a URL is a valid Instagram Reel URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid Instagram Reel URL
 */
export function validateUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }
    
    // Check if it's an Instagram reel URL
    const instagramReelPattern = /^https?:\/\/(www\.)?instagram\.com\/(reel|reels)\/[A-Za-z0-9_-]+\/?/;
    return instagramReelPattern.test(url);
}

/**
 * Download video from URL
 * @param {string} videoUrl - Video URL to download
 * @param {string} filename - Filename without extension
 * @returns {string} Path to downloaded video file
 */
export async function downloadVideo(videoUrl, filename) {
    try {
        console.log('Downloading video...');
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const videoPath = path.join(tempDir, `${filename}.mp4`);
        
        // Download video
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
            timeout: 120000, // 2 minutes timeout
        });
        
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        
        console.log(`✓ Video downloaded: ${videoPath}`);
        return videoPath;
    } catch (error) {
        console.error(`Video download error: ${error.message}`);
        throw new Error(`Failed to download video: ${error.message}`);
    }
}

/**
 * Extract audio from video file using ffmpeg
 * @param {string} videoPath - Path to video file
 * @returns {string} Path to extracted audio file
 */
export async function extractAudioFromVideo(videoPath) {
    try {
        console.log('Extracting audio from video...');
        
        const audioPath = videoPath.replace('.mp4', '.mp3');
        
        // Check if ffmpeg is available
        try {
            await execPromise('ffmpeg -version');
        } catch (error) {
            throw new Error('ffmpeg is not installed or not available in PATH');
        }
        
        // Extract audio using ffmpeg
        const command = `ffmpeg -i "${videoPath}" -vn -ar 16000 -ac 1 -ab 96k -f mp3 "${audioPath}" -y`;
        
        await execPromise(command);
        
        // Verify audio file was created
        if (!fs.existsSync(audioPath)) {
            throw new Error('Audio extraction failed - file not created');
        }
        
        console.log(`✓ Audio extracted: ${audioPath}`);
        
        // Clean up video file to save space
        try {
            fs.unlinkSync(videoPath);
        } catch (cleanupError) {
            console.warn(`Could not delete video file: ${cleanupError.message}`);
        }
        
        return audioPath;
    } catch (error) {
        console.error(`Audio extraction error: ${error.message}`);
        throw new Error(`Failed to extract audio: ${error.message}`);
    }
}

/**
 * Clean up temporary files
 * @param {string} filePath - Path to file to delete
 */
export function cleanupFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✓ Cleaned up: ${filePath}`);
        }
    } catch (error) {
        console.warn(`Could not delete file ${filePath}: ${error.message}`);
    }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Clean Instagram URL by removing tracking parameters
 * @param {string} url - Instagram URL
 * @returns {string} Cleaned URL
 */
export function cleanInstagramUrl(url) {
    try {
        const urlObj = new URL(url);
        // Remove tracking parameters like ?igsh=
        urlObj.search = '';
        urlObj.hash = '';
        return urlObj.toString();
    } catch (e) {
        console.log('⚠️ Error cleaning URL, using original:', e.message);
        return url;
    }
}

