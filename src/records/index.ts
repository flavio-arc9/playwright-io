import { TestInfo } from "@playwright/test";
import { Context, RecorderOptions } from "../types";
import { MobileRecorder } from "./mobile";
import { BrowserRecorder } from "./browser";

export class Recorder {

	private readonly mobileRecorder: MobileRecorder;
	private readonly browserRecorder: BrowserRecorder;

	constructor(
		private driver: Context, 
		private testInfo: TestInfo, 
		private options: Partial<RecorderOptions> = {}
	) {
		this.mobileRecorder = new MobileRecorder(this.driver, this.testInfo, this.options);
		this.browserRecorder = new BrowserRecorder(this.driver, this.testInfo, this.options);
	}

	/**
     * Starts recording based on session type (mobile vs browser).
     */
	async start(isBrowser: boolean) {
		if (!isBrowser) {
			await this.mobileRecorder.start();
		} else {
			await this.browserRecorder.start();
		}
	}

	/**
	 * Stops recording based on session type (mobile vs browser).
	 */
	async stop(isBrowser: boolean): Promise<void> {
		if (!this.driver) return;

		if (!isBrowser) {
			await this.mobileRecorder.stop();
		} else {
			await this.browserRecorder.stop();
		}
	}

	/**
     * Captures a screenshot and attaches it to the test report.
     * Only captures screenshots for terminal test states (passed, failed, timedOut, interrupted).
     */
	async screenshot() {
		const currentStatus =
			this.testInfo.status === 'passed' ||
			this.testInfo.status === 'failed' ||
			this.testInfo.status === 'timedOut' ||
			this.testInfo.status === 'interrupted'

		if (currentStatus) {
			const screenshotBase64 = await this.driver.takeScreenshot();
			const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');

			this.testInfo.attach('screenshot', {
				body: screenshotBuffer,
				contentType: 'image/png'
			});
		};
	}
}