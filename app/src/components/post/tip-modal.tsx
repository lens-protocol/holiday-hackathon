'use client';

import { useState } from 'react';
import { Address } from 'viem';
import { IPopulatedPost } from '@/backend/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTokenContract } from '@/contracts/hooks/use-tokenomic';

interface TipModalProps {
  post: IPopulatedPost;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TipModal({ post, isOpen, onOpenChange }: TipModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const contractService = useTokenContract();

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue > 0;
  };

  const convertToWei = (amount: string): bigint => {
    // Handle decimal places properly by removing the decimal point
    const [whole, decimal = ''] = amount.split('.');
    const paddedDecimal = decimal.padEnd(18, '0');
    return BigInt(whole + paddedDecimal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isLoading || !validateAmount(amount)) return;

    setIsLoading(true);
    try {
      if (!post._id) {
        throw new Error('Post ID is required');
      }

      if (!post.profile.address) {
        throw new Error('Creator address is required');
      }

      const amountInWei = convertToWei(amount);

      const hash = await contractService.sendTip({
        creator: post.profile.address as Address,
        amount: amountInWei,
        postId: post._id,
      });

      toast({
        title: 'Tip sent successfully!',
        description: `You sent ${amount} tokens to ${post.profile.name}`,
      });

      // Reset form and close modal
      onOpenChange(false);
      setAmount('');
    } catch (error) {
      console.error('Tip error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send tip',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while sending the tip',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Send tip to {post.profile.name}</DialogTitle>
          <DialogDescription>
            Support {post.profile.name}&apos;s content by sending them tokens
            directly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='amount'>Amount (in tokens)</Label>
              <Input
                id='amount'
                type='text'
                pattern='^\d*\.?\d*$'
                placeholder='Enter amount...'
                value={amount}
                onChange={handleAmountChange}
                disabled={isLoading}
                className='font-mono'
              />
            </div>
            <div className='text-sm text-muted-foreground'>
              <strong>Recipient:</strong> @{post.profile.handle}
            </div>
            <div className='text-sm text-muted-foreground'>
              <strong>Creator Address:</strong> {post.profile.address}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !validateAmount(amount)}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                'Send Tip'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
