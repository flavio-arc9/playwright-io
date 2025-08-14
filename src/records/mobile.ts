import { TestInfo } from "@playwright/test";
import { Context, RecorderOptions } from "../types";

export class MobileRecorder {

    private static readonly DEFAULT_OPTIONS: Required<RecorderOptions> = {
        videoType: 'mp4',
        quality: 'medium',
        maxDuration: 180 // 3 minutes in seconds (WebDriverIO default)
    };	private readonly options: Required<RecorderOptions>;

	constructor(
		private driver: Context, 
		private testInfo: TestInfo,
		options: Partial<RecorderOptions> = {}) {
		this.options = {
			...MobileRecorder.DEFAULT_OPTIONS,
			...options
		};
	}

	/**
	 * Starts screen recording on the mobile device.
	 */
	async start() {
		try {
			const timeLimit = this.options.maxDuration || 180; // Default 3 minutes
			const validTimeLimit = Math.min(Math.max(timeLimit, 1), 1800);
			
			await this.driver.startRecordingScreen({
				videoType: this.options.videoType,
				videoQuality: this.options.quality,
				timeLimit: validTimeLimit,
			});
		} catch (error) {
			console.error('❌ Failed to start mobile screen recording:', error);
		}
	}

	/**
	 * Stops screen recording and attaches the video to the test report.
	 */
	async stop() {
		try {
			const videoBase64 = await this.driver.stopRecordingScreen();
			await this.attachVideo(videoBase64);
		} catch (error) {
            console.error('❌ Failed to stop mobile screen recording:', error);
        }
	}

	/**
	 * Attaches the recorded video to the test report.
	 */
	private async attachVideo(videoBase64: string) {
		try {
			const videoBuffer = Buffer.from(videoBase64, 'base64');
			await this.testInfo.attach('video', {
				body: videoBuffer,
				contentType: `video/${this.options.videoType}`
			});
		} catch (error) {
			console.error('Failed to attach video to test report:', error);
		}
	}
}