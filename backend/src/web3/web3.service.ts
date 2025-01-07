// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { QueueNames } from 'src/packages/queues/base';
import { QueuesService } from 'src/packages/queues/queues.service';
import projectABI from './abi/influencerABI';
const Web3 = require('web3');
import { Provider } from '@lens-network/sdk/ethers';
import { ethers } from 'ethers';

let codeBlockChecking = 0;
@Injectable()
export class Web3Service {
  constructor(
    private queuesService: QueuesService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    this.init();
  }
  public contractAddress = process.env.SMART_CONTRACT_ADDR;
  public ethProvider = process.env.RPC_URL;
  public lensProvider = 'https://lens-sepolia.g.alchemy.com/v2/ImFxenHhNywJzLxDFBA0NiaQtRSHT5D_';
  public provider: any;
  public web3: any;
  public contract: any;
  public web3Wss: any;
  public lensWeb3: any;

  private async init() {
    this.initNormalizeWeb3();
  }
  private initNormalizeWeb3() {
    this.web3 = new Web3(this.ethProvider);
    this.contract = new this.web3.eth.Contract(projectABI as any, this.contractAddress);

    this.provider = new Provider(
      'https://lens-sepolia.g.alchemy.com/v2/ImFxenHhNywJzLxDFBA0NiaQtRSHT5D_',
    );
    this.contract = new ethers.Contract(this.contractAddress, projectABI, this.provider);
  }
  public async getPastEvents() {
    const redisBlockKey = 'web3_block_read';
    const redisBlockRead: any = await this.cacheService.get(redisBlockKey);
    // if (!codeBlockChecking) codeBlockChecking = parseInt(redisBlockRead) || 500204
    if (!codeBlockChecking) codeBlockChecking = parseInt(redisBlockRead) || 133560;
    console.log(codeBlockChecking, redisBlockRead, this.contractAddress);
    const pastLogs = await this.provider.getLogs({
      fromBlock: codeBlockChecking + 1,
      toBlock: 'latest',
      address: this.contractAddress,
    });
    const iface = new ethers.Interface(projectABI);
    const pastEvents = pastLogs.map((log) => {
      const parsed = iface.parseLog(log);
      return {
        ...parsed,
        ...log,
        blockNumber: log.blockNumber,
      };
    });

    console.log('pastEvents :::: ', pastEvents);
    for (const val of pastEvents) {
      console.log('val', val);
      // console.log('val.returnValues :::: ', val.returnValues);
      codeBlockChecking = val.blockNumber;
      await this.cacheService.set(redisBlockKey, codeBlockChecking);
      let obj: any = {
        eventName: val.name,
      };
      let sendData = false;
      switch (val.name) {
        case 'IdentityCreated':
          {
            sendData = true;
            const [owner, name, role, description = null] = val.args;
            obj = { ...obj, owner, name, role: Number(role), description };
          }
          break;
        case 'DealCreated':
          {
            sendData = true;
            const [dealId, dealName, brand, totalBudget, influencers, ratingRanges] = val.args;
            const totalBudgetPrice = Number(totalBudget) / 10 ** 18;
            obj = {
              ...obj,
              dealId: dealId.toString(),
              dealName,
              brand,
              totalBudget: totalBudget.toString(),
              totalBudgetPrice,
              influencers,
              ratingRanges,
            };
          }
          break;
        case 'DealAccepted':
          sendData = true;
          break;
        case 'DealRejected':
          sendData = true;
          break;
        case 'RewardReleased': {
          sendData = true;
          const [dealId, influencer, rewardAmount, rating] = val.args;
          obj = {
            ...obj,
            dealId: Number(dealId).toString(),
            influencer,
            rewardAmount: Number(rewardAmount),
            rating: Number(rating),
            trx: val.transactionHash,
          };
          break;
        }
        default:
      }
      if (sendData) {
        console.log('obj :::: ', obj);
        await this.queuesService.pushMessage(QueueNames.EventParser, obj);
      }
    }
  }
}
