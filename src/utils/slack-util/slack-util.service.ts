import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackUtilService {
    constructor(private readonly configService: ConfigService) {
        this.slackWebhookUrl = this.configService.getOrThrow<string>('SLACK_WEBHOOK_URL');
    }

    private readonly slackWebhookUrl: string;

    public async sendSlackMessage(message: string): Promise<void> {
        await axios.post(this.slackWebhookUrl, {
            text: message,
            mrkdwn: true,
        });
    }
}
