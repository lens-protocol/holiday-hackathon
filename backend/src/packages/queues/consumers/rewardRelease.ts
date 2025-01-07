import { OnQueueActive, OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from 'nestjs-prisma';
import { QueueNames } from '../base';
import projectABI from './../../../web3/abi/influencerABI';
const Web3 = require('web3');

@Injectable()
@Processor(QueueNames.RewardRelease)
export class RewardReleaseConsumer {
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
    console.log('QUEUED JOB FOR PARSING THE reward release txs :::: ', {
      job: job.data,
    });

    const { deal_id: id, deal_external_id: deal_id, influencer_address, amount, rating } = job.data;
    const contractAddress = process.env.SMART_CONTRACT_ADDR;
    const ethProvider = process.env.RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    const web3 = new Web3(ethProvider);
    const contract = new web3.eth.Contract(projectABI as any, contractAddress);
    const bnAmt = new web3.utils.toBN(Number(amount) * Math.pow(10, 18));

    console.log('REACHEDD HERER');
    const tx = {
      from: process.env.REWARD_RELEASE_FROM_ADDR,
      to: contractAddress,
      gas: 20000000, // Adjust gas limit as needed
      // nonce: nonce,
      data: contract.methods['releaseReward'](
        Number(deal_id),
        Number(rating),
        bnAmt,
        influencer_address,
      ).encodeABI(),
    };

    console.log('REACHEDD HERER 111', {
      tx,
    });
    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    console.log('REACHEDD HERER 222', {
      tx,
    });
    // Send the transaction
    const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    if (result?.blockHash) {
      await this.prismaService.dealSubmission.update({
        where: {
          id,
        },
        data: {
          reward_release_tx_hash: result?.blockHash,
        },
      });
    }

    console.log('RAW TX EXCUTED ::: ', {
      result,
    });

    console.log('RESULT RECEIVED FROM TX HASH MSG ::: ', {
      result,
    });
  }
}
