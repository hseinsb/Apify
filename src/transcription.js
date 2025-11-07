import { Actor } from 'apify';
import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Transcribe audio using the specified service
 * @param {string} audioPath - Path to audio file
 * @param {string} service - Transcription service ('openai' or 'assemblyai')
 * @param {object} apiKeys - API keys for transcription services
 * @returns {string} Transcribed text
 */
export async function transcribeAudio(audioPath, service, apiKeys) {
    if (service === 'openai') {
        return await transcribeWithOpenAI(audioPath, apiKeys.openaiApiKey);
    } else if (service === 'assemblyai') {
        return await transcribeWithAssemblyAI(audioPath, apiKeys.assemblyaiApiKey);
    } else {
        throw new Error(`Unsupported transcription service: ${service}`);
    }
}

/**
 * Transcribe audio using OpenAI Whisper API
 * @param {string} audioPath - Path to audio file
 * @param {string} apiKey - OpenAI API key
 * @returns {string} Transcribed text
 */
async function transcribeWithOpenAI(audioPath, apiKey) {
    try {
        console.log('Using OpenAI Whisper for transcription...');
        
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const audioFile = fs.createReadStream(audioPath);
        
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: 'en', // Can be made configurable
            response_format: 'text',
        });

        return transcription.trim();
    } catch (error) {
        console.error(`OpenAI transcription error: ${error.message}`);
        throw new Error(`OpenAI transcription failed: ${error.message}`);
    }
}

/**
 * Transcribe audio using AssemblyAI API
 * @param {string} audioPath - Path to audio file
 * @param {string} apiKey - AssemblyAI API key
 * @returns {string} Transcribed text
 */
async function transcribeWithAssemblyAI(audioPath, apiKey) {
    try {
        console.log('Using AssemblyAI for transcription...');
        
        const assemblyaiUrl = 'https://api.assemblyai.com/v2';
        
        // Step 1: Upload the audio file
        console.log('Uploading audio file to AssemblyAI...');
        const audioData = fs.readFileSync(audioPath);
        
        const uploadResponse = await axios.post(
            `${assemblyaiUrl}/upload`,
            audioData,
            {
                headers: {
                    'authorization': apiKey,
                    'content-type': 'application/octet-stream',
                },
            }
        );
        
        const uploadUrl = uploadResponse.data.upload_url;
        console.log('✓ Audio file uploaded');

        // Step 2: Request transcription
        console.log('Requesting transcription...');
        const transcriptResponse = await axios.post(
            `${assemblyaiUrl}/transcript`,
            {
                audio_url: uploadUrl,
                language_code: 'en', // Can be made configurable
            },
            {
                headers: {
                    'authorization': apiKey,
                    'content-type': 'application/json',
                },
            }
        );
        
        const transcriptId = transcriptResponse.data.id;
        console.log(`Transcription job created: ${transcriptId}`);

        // Step 3: Poll for completion
        let transcript;
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            
            const pollingResponse = await axios.get(
                `${assemblyaiUrl}/transcript/${transcriptId}`,
                {
                    headers: {
                        'authorization': apiKey,
                    },
                }
            );
            
            const status = pollingResponse.data.status;
            
            if (status === 'completed') {
                transcript = pollingResponse.data.text;
                console.log('✓ Transcription completed');
                break;
            } else if (status === 'error') {
                throw new Error(`AssemblyAI transcription failed: ${pollingResponse.data.error}`);
            }
            
            console.log(`Transcription status: ${status}...`);
            attempts++;
        }
        
        if (!transcript) {
            throw new Error('Transcription timeout - took longer than expected');
        }
        
        return transcript.trim();
    } catch (error) {
        console.error(`AssemblyAI transcription error: ${error.message}`);
        throw new Error(`AssemblyAI transcription failed: ${error.message}`);
    }
}

