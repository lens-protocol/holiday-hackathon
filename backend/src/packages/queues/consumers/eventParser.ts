import { OnQueueActive, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from 'nestjs-prisma';
import { QueueNames } from '../base';

@Injectable()
@Processor(QueueNames.EventParser)
export class EventParserConsumer {
  constructor(readonly prismaService: PrismaService) {}

  @OnQueueError()
  onError(err: any) {
    console.error(err); // <<<<<<
  }

  @OnQueueActive()
  onActive(job: Job) {
    /* console.log(Processing job - ${job.id}, {
              data: job.data,
            }); */
  }

  @OnQueueFailed()
  async onProcessing(job: Job, err: Error) {
    if (err && err.message === 'job stalled more than allowable limit') {
      // await job.remove().catch((err) => {
      //     console.error(jobId: ${job.id} remove error: ${err.message}, err.stack);
      // });
    }
    console.log(err);
    if (typeof job?.discard === 'function') job.discard();
  }

  @Process()
  async handleSyncEventParser(job: any) {
    console.log('QUEUED JOB FOR PARSING THE EVENTS :::: ', {
      job: job.data,
    });

    const { eventName } = job.data;
    switch (eventName) {
      case 'IdentityCreated':
        {
          const { name, role, description = null, owner } = job.data;
          const data = {
            name,
            description,
            address: owner,
          };
          if (role == '1') {
            const response = await this.prismaService.influencer.findFirst({
              where: {
                address: data.address,
              },
            });
            if (!response) await this.prismaService.influencer.create({ data });
          } else {
            const response = await this.prismaService.brand.findFirst({
              where: {
                address: data.address,
              },
            });
            if (!response) await this.prismaService.brand.create({ data });
          }
        }
        break;
      case 'DealCreated':
        {
          const {
            dealId: deal_id,
            dealName: name,
            brand,
            totalBudgetPrice,
            influencers = [],
            ratingRanges: rating_range,
          } = job.data;
          const dealChecking = await this.prismaService.deal.findFirst({
            where: {
              deal_id,
            },
          });
          if (!dealChecking) {
            const obj = {
              deal_id,
              name,
              brand_address: brand,
              budget: `${totalBudgetPrice}`,
              rating_range,
              status: 'PENDING',
              influencer: influencers,
            } as const;
            await this.prismaService.deal.create({ data: obj });
          }
        }
        break;
      case 'DealAccepted':
        {
        }
        break;
      case 'DealRejected':
        {
        }
        break;
      case 'RewardReleased':
        {
          const { dealId, influencer, trx } = job.data;
          console.log({ dealId, influencer, trx });
          const findDealId = await this.prismaService.deal.findFirst({
            where: {
              deal_id: dealId,
            },
          });
          console.log(findDealId, ' ::: findDealId');
          const deal = await this.prismaService.dealSubmission.findFirst({
            where: {
              OR: [
                {
                  deal_id: findDealId.id,
                },
                {
                  deal_id: dealId,
                },
              ],
              influencer_address: influencer,
              reward_release_tx_hash: null,
            },
          });
          console.log(deal, ' ::: deal');
          if (deal) {
            await this.prismaService.dealSubmission.update({
              where: {
                id: deal.id,
              },
              data: {
                reward_release_tx_hash: trx,
              },
            });
          }
        }
        break;
      default:
    }
  }
}
