import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const BuyTicketWidget = ({ event, contract }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const price = event.Price * quantity;
      await contract.buyTickets(event.id, quantity, {
        value: ethers.parseEther(price.toString())
      });
      // Handle success
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card glowing>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Purchase Tickets</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max={event.Capacity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-gray-800 rounded-lg p-2 w-24 input-glow"
          />
          <span className="text-gray-400">
            Total: {event.Price * quantity} ETH
          </span>
        </div>
        <Button onClick={handlePurchase} disabled={loading}>
          {loading ? <Loader /> : 'Buy Tickets'}
        </Button>
      </div>
    </Card>
  );
};
