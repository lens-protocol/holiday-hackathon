import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdentitiesService } from './identities.service';
import { identitiesDto } from './dto/identities.dto';

@ApiTags('Identities')
@Controller({
  path: '/identities',
  version: '1',
})
export class IdentitiesController {
  constructor(private readonly identityService: IdentitiesService) { }

  @Get('brands')
  async getBrands() {
    const resp = await this.identityService.fetchBrands();
    return resp;
  }

  @Get('brands/:id')
  async getBrandById(@Param('id') id: string) {
    const resp = await this.identityService.fetchBrandById(id);
    return resp;
  }

  @Get('influencers')
  async getInfluencers() {
    const resp = await this.identityService.fetchInfluencers();
    return resp;
  }

  @Get('influencers/:id')
  async getInfluencerById(@Param('id') id: string) {
    const resp = await this.identityService.fetchInfluencerById(id);
    return resp;
  }

  @Get('deals')
  async getDeals() {
    const resp = await this.identityService.fetchDeals();
    return resp;
  }

  @Get('deals/:id')
  async getDealById(@Param('id') id: string) {
    const resp = await this.identityService.fetchDealById(id);
    return resp;
  }
  @Post('deal-influencer-submit')
  async submitDealInfluencer(@Body() body: identitiesDto) {
    const resp = await this.identityService.submitDealInfluencerService(body);
    return resp;
  }
  @Get('influencers/address/:id')
  async getInfluencerByAddress(@Param('id') id: string) {
    const resp = await this.identityService.fetchInfluencerByAddress(id);
    return resp;
  }
}
