import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class SchedulerService {
  constructor(private web3Service: Web3Service) {
    // this.getReadingContractEvent();
    this.getPastEvents();
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async handleWhatsappTemplateToSync() {
  //   console.log('WHATSAPP PENDING TEMPLATE TO SEND CRON IS RUNNING');
  // }
  // @Cron(CronExpression.EVERY_10_SECONDS)

  private async delay(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  @Cron(CronExpression.EVERY_10_SECONDS)
  async getPastEvents() {
    // await this.delay(2000)
    console.log('GETTING READ BLOCK AND FINDING NEW EVENT');
    await this.web3Service.getPastEvents();
  }
  // async getReadingContractEvent() {
  //   await this.delay(2000)
  //   await this.web3Service.getContractEventRead();
  //   // await this.web3Service;
  // }
}
