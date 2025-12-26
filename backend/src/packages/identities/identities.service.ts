import { BadRequestException, Injectable } from '@nestjs/common';
import { JsonArray } from '@prisma/client/runtime/library';
import { PrismaService } from 'nestjs-prisma';
import { ClaudeAiService } from '../claude-ai/claude-ai.service';
import { QueuesService } from '../queues/queues.service';
import { QueueNames } from '../queues/base';
import { identitiesDto } from './dto/identities.dto';

@Injectable()
export class IdentitiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly claudAIService: ClaudeAiService,
    private readonly queueService: QueuesService,
  ) { }

  async fetchBrands() {
    return this.prismaService.brand.findMany();
  }

  async fetchInfluencers() {
    return this.prismaService.influencer.findMany();
  }

  async fetchDeals() {
    return this.prismaService.deal.findMany({
      include: {
        submissions: true,
      },
    });
  }

  async fetchBrandById(id: string) {
    const resp = await this.prismaService.brand.findFirst({
      where: {
        id,
      },
    });

    if (!resp) throw new BadRequestException('Brand not found !');
    return resp;
  }

  async fetchInfluencerById(id: string) {
    const resp = await this.prismaService.influencer.findFirst({
      where: {
        id,
      },
    });

    if (!resp) {
      throw new BadRequestException('Influencer not found !');
    }
    return resp;
  }
  async fetchInfluencerByAddress(id: string) {
    let resp = await this.prismaService.deal.findMany({
      where: {},
      include: {
        rewards: true,
        submissions: true,
      },
    });

    if (resp) {
      resp = resp.filter((item) => (item.influencer as JsonArray).includes(id));
      // throw new BadRequestException('Influencer not found !');
    }
    return resp || [];
  }

  async fetchDealById(id: string) {
    const resp = await this.prismaService.deal.findFirst({
      where: {
        id,
      },
      include: {
        submissions: true,
      },
    });

    if (!resp) {
      throw new BadRequestException('Deal not found !');
    }
    return resp;
  }
  async submitDealInfluencerService(body: identitiesDto) {
    const { id: deal_id, address: influencer_address, link: submission_link } = body;
    const checkingExistData = await this.prismaService.dealSubmission.findFirst({
      where: {
        deal_id,
        influencer_address,
      },
    });
    if (checkingExistData) throw new BadRequestException('Already submitted !');
    const claudRating = await this.claudAIService.parseContext(
      {
        brand: deal_id,
        videoId: submission_link,
      },
      true,
    );
    // Calculate the the amount to release
    const deal = await this.prismaService.deal.findFirst({
      where: {
        deal_id,
      },
    });
    if (!deal) {
      throw new BadRequestException('Deal not found !');
    }

    let availableBudget = Number(deal.budget);
    const existingSubmissions = await this.prismaService.dealSubmission.findMany({
      where: {
        influencer_address,
        deal_id,
      },
    });
    if (existingSubmissions && existingSubmissions.length) {
      existingSubmissions.map(({ amount }) => {
        availableBudget -= availableBudget > 0 ? Number(amount) : 0;
      });
    }

    const amountToRelease = (availableBudget / 100) * 20;
    if (amountToRelease <= 0) {
      throw new BadRequestException('No amount left to release !');
    }
    const response = await this.prismaService.dealSubmission.create({
      data: {
        deal: { connect: { id: deal.id } },
        influencer_address,
        submission_link,
        rating: claudRating.toString(),
        amount: amountToRelease.toString(),
      },
    });
    this.queueService.pushMessage(QueueNames.RewardRelease, {
      deal_id: deal.id,
      deal_external_id: deal_id,
      influencer_address,
      amount: amountToRelease,
      rating: claudRating.toString(),
    });
    return response;
  }
}
