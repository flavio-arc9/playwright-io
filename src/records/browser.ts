import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { Context, RecorderOptions } from '../types';
import { existsSync } from 'node:fs';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { glob } from 'glob';
import { tmpdir } from 'node:os';
import { TestInfo } from '@playwright/test';

const VideoType = {
    mp4: {
        fileExtension: 'mp4',
        contentType: 'video/mp4',
        vcodec: 'libx264',
    },
    webm: {
        fileExtension: 'webm',
        contentType: 'video/webm',
        vcodec: 'libvpx-vp9',
    }
} as const;

interface QualitySettings {
    crf: number;
    scale: string;
}

export class BrowserRecorder {

    private static readonly DEFAULT_OPTIONS: Required<RecorderOptions> = {
        videoType: 'mp4',
        quality: 'medium',
        maxDuration: 180 // 3 minutes in seconds
    };

    private static readonly SCREENSHOT_INTERVAL_MS = 500;

    private static readonly QUALITY_SETTINGS: Record<string, QualitySettings> = {
        high: { crf: 18, scale: '1920:trunc(ow/a/2)*2' },
        medium: { crf: 23, scale: '1280:trunc(ow/a/2)*2' },
        low: { crf: 32, scale: '800:trunc(ow/a/2)*2' }
    };

    private static readonly PLACEHOLDER_IMAGE_SVG = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <rect x="1" y="1" width="398" height="298" fill="none" stroke="#ddd" stroke-width="2"/>
        <text x="200" y="140" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#666">
            Image not found
        </text>
        <text x="200" y="170" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#999">
            Screenshot unavailable
        </text>
        </svg>
    `;

    private readonly options: RecorderOptions;
    private readonly baseOutputDir: string;
    private readonly placeholderImage: string;

    private outputDir = '';
    private frameNumber = 0;
    private screenshotInterval?: NodeJS.Timeout;
    private testName?: string;

    constructor(
        private driver: Context, 
        private testInfo: TestInfo,
        options: Partial<RecorderOptions> = {}
    ) {
        this.options = { ...BrowserRecorder.DEFAULT_OPTIONS, ...options };
        this.baseOutputDir = tmpdir();
        this.placeholderImage = 'data:image/svg+xml;base64,' + Buffer.from(BrowserRecorder.PLACEHOLDER_IMAGE_SVG).toString('base64');
    }

    /**
     * Starts recording by setting up screenshot capture intervals.
     */
    async start() {
        this.testName = this.createTestName();
        this.outputDir = this.createOutputDirectory();

        this.screenshotInterval = setInterval(
            () => this.captureScreenshot(),
            BrowserRecorder.SCREENSHOT_INTERVAL_MS
        );
    }

    /**
     * Stops recording and generates video from captured screenshots.
     */
    async stop() {
        this.clearScreenshot();

        try {
            await this.generateVideo();
        } finally {
            this.performCleanup();
        }
    }

    /**
     * Captures a screenshot and saves it as a frame for video generation.
     */
    private async captureScreenshot() {
        const frameIndex = this.frameNumber++;
        const filePath = path.resolve(this.outputDir, `${this.formatFrameNumber(frameIndex)}.png`);

        try {
            const screenshot = await this.driver.takeScreenshot();
            fs.writeFileSync(filePath, screenshot, 'base64');
        } catch (error) {
            this.writePlaceholderImage(filePath);
        }
    }

    /**
     * Writes a placeholder image when screenshot capture fails.
     */
    private writePlaceholderImage(filePath: string) {
        try {
            fs.writeFileSync(filePath, this.placeholderImage, 'base64');
        } catch (writeError) {
            console.error('Failed to write placeholder image:', writeError);
        }
    }

    /**
     * Generates video from captured screenshots using FFmpeg.
     */
    private async generateVideo() {
        const format = this.options.videoType as keyof typeof VideoType;
        const fileExtension = VideoType[format].fileExtension;
        const videoPath = path.resolve(this.outputDir, `${this.testName}.${fileExtension}`);

        const frameFiles = await this.getFrameFiles();
        if (frameFiles.length === 0) {
            return;
        }

        await this.interpolateMissingFrames(frameFiles);
        await this.renderVideo(videoPath);
    }

    /**
     * Gets all frame files from the output directory.
     */
    private async getFrameFiles() {
        try {
            return await glob(`${this.outputDir}/*.png`);
        } catch (error) {
            console.error('Failed to get frame files:', error);
            return [];
        }
    }

    /**
     * Creates video using FFmpeg with the specified parameters.
     */
    private async renderVideo(videoPath: string) {
        const ffmpegArgs = this.buildArgs(videoPath);

        return new Promise((resolve, reject) => {
            const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, {
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: false
            });

            this.setupProcessHandlers(ffmpegProcess, videoPath, resolve, reject);
            this.setupTimeout(ffmpegProcess, reject);
        });
    }

    /**
     * Sets up event handlers for the FFmpeg process.
     */
    private setupProcessHandlers(
        ffmpegProcess: any,
        videoPath: string,
        resolve: (value: unknown) => void,
        reject: (error: Error) => void
    ) {
        ffmpegProcess.on('close', async (code: number) => {
            if (code === 0) {
                try {
                    await this.attachVideo(videoPath);
                    resolve(undefined);
                } catch (error) {
                    reject(error as Error);
                }
            } else {
                reject(new Error(`FFmpeg process exited with code ${code}`));
            }
        });

        ffmpegProcess.on('error', (error: Error) => {
            reject(error);
        });
    }

    /**
     * Sets up timeout protection for FFmpeg process.
     */
    private setupTimeout(ffmpegProcess: any, reject: (error: Error) => void) {
        const timeoutMs = (this.options.maxDuration || 180) * 1000; // Convert seconds to milliseconds
        setTimeout(() => {
            ffmpegProcess.kill('SIGKILL');
            reject(new Error(`FFmpeg timeout after ${timeoutMs} ms (${this.options.maxDuration || 180} seconds)`));
        }, timeoutMs);
    }

    /**
     * Gets quality settings based on the quality option (string or number).
     */
    private getQualitySettings(): QualitySettings {
        const quality = this.options.quality;
        
        // If quality is a number, use it as CRF value with medium scale
        if (typeof quality === 'number') {
            return {
                crf: quality,
                scale: '1280:trunc(ow/a/2)*2'
            };
        }
        
        // If quality is a string, use predefined settings
        return BrowserRecorder.QUALITY_SETTINGS[quality!] || BrowserRecorder.QUALITY_SETTINGS.medium;
    }

    /**
     * Builds FFmpeg command line arguments for video generation.
     */
    private buildArgs(videoPath: string): string[] {
        const format = this.options.videoType as keyof typeof VideoType;
        const videoFormat = VideoType[format];
        const qualitySettings = this.getQualitySettings();

        return [
            '-y',
            '-r', '10',
            '-i', path.join(this.outputDir, '%04d.png'),
            '-vcodec', videoFormat.vcodec,
            '-crf', String(qualitySettings.crf),
            '-pix_fmt', 'yuv420p',
            '-vf', `scale=${qualitySettings.scale},setpts=3.0*PTS`,
            '-movflags', '+faststart',
            videoPath,
        ];
    }

    /**
     * Attaches the generated video to the test report.
     */
    private async attachVideo(videoPath: string) {
        this.validateFile(videoPath);

        const videoBuffer = fs.readFileSync(videoPath);
        const format = this.options.videoType as keyof typeof VideoType;
        const videoFormat = VideoType[format];

        await this.testInfo.attach('video', {
            body: videoBuffer,
            contentType: videoFormat.contentType,
        });
    }

    /**
     * Validates that the video file exists and is not empty.
     */
    private validateFile(videoPath: string): void {
        if (!existsSync(videoPath)) {
            throw new Error('Video file was not created');
        }

        const stats = fs.statSync(videoPath);
        if (stats.size === 0) {
            throw new Error('Video file is empty');
        }
    }

    /**
     * Interpolates missing frames by copying the previous frame.
     */
    private async interpolateMissingFrames(frames: string[]) {
        if (frames.length === 0) {
            return;
        }

        const frameNumbers = this.extractFrameNumbers(frames);
        if (frameNumbers.length === 0) {
            return;
        }

        const missingFrames = this.findMissingFrames(frameNumbers);
        await this.fillMissingFrames(missingFrames, frameNumbers);
    }

    /**
     * Extracts and sorts frame numbers from frame file paths.
     */
    private extractFrameNumbers(frames: string[]): number[] {
        return frames
            .map(framePath => {
                const match = framePath.match(/(\d{4})\.png$/);
                return match ? parseInt(match[1], 10) : null;
            })
            .filter((num): num is number => num !== null)
            .sort((a, b) => a - b);
    }

    /**
     * Finds which frames are missing in the sequence.
     */
    private findMissingFrames(frameNumbers: number[]): Array<{ missing: number, previous: number }> {
        const missingFrames: Array<{ missing: number, previous: number }> = [];
        const frameSet = new Set(frameNumbers);
        
        const firstFrame = frameNumbers[0];
        const lastFrame = frameNumbers[frameNumbers.length - 1];
        let previousFrame = firstFrame;

        for (let currentFrame = firstFrame + 1; currentFrame <= lastFrame; currentFrame++) {
            if (!frameSet.has(currentFrame)) {
                missingFrames.push({ missing: currentFrame, previous: previousFrame });
            } else {
                previousFrame = currentFrame;
            }
        }

        return missingFrames;
    }

    /**
     * Fills missing frames by copying from previous frames.
     */
    private async fillMissingFrames(
        missingFrames: Array<{ missing: number, previous: number }>,
        frameNumbers: number[]
    ) {
        const expectedFrameCount = frameNumbers[frameNumbers.length - 1] - frameNumbers[0] + 1;
        
        if (frameNumbers.length === expectedFrameCount) {
            return;
        }

        const copyPromises = missingFrames.map(({ missing, previous }) => {
            const sourcePath = path.join(this.outputDir, `${this.formatFrameNumber(previous)}.png`);
            const targetPath = path.join(this.outputDir, `${this.formatFrameNumber(missing)}.png`);
            return fsp.copyFile(sourcePath, targetPath);
        });

        await Promise.all(copyPromises);
    }

    /**
     * Creates a safe filename from test name with character limits.
     */
    private createTestName(maxCharacters: number = 250): string {
        const testName = this.testInfo.title;
        const sanitizedName = testName.replace(/\s+/g, '-');
        let filename = encodeURIComponent(sanitizedName)
            .replace(/%../g, '')
            .replace(/\./g, '-')
            .replace(/[/\\?%*:'|"<>()]/g, '');

        if (filename.length > maxCharacters) {
            const truncateLength = Math.floor((maxCharacters - 1) / 2);
            filename = filename.slice(0, truncateLength) + '_' + filename.slice(-truncateLength);
        }

        return filename;
    }

    /**
     * Formats frame number with leading zeros for proper ordering.
     */
    private formatFrameNumber(frameNumber: number): string {
        return frameNumber.toString().padStart(4, '0');
    }

    /**
     * Creates output directory for storing frame images.
     */
    private createOutputDirectory(): string {
        const dirPath = path.resolve(this.baseOutputDir, this.testName!);
        fs.mkdirSync(dirPath, { recursive: true });
        return dirPath;
    }

    /**
     * Clears the screenshot capture interval.
     */
    private clearScreenshot(): void {
        if (this.screenshotInterval) {
            clearInterval(this.screenshotInterval);
            this.screenshotInterval = undefined;
        }
    }

    /**
     * Performs cleanup operations after recording.
     */
    private performCleanup(): void {
        if (existsSync(this.outputDir)) {
            this.frameNumber = 0;
            
            try {
                fs.rmSync(this.outputDir, { recursive: true, force: true });
            } catch (error) {
                console.error('Failed to cleanup output directory:', error);
            }
        }
    }
}