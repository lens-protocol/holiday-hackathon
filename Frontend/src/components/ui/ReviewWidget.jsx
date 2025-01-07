import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const ReviewWidget = ({ eventId, contract, onReviewAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contract.giveReview(eventId, comment);
      onReviewAdded();
      setComment('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full h-32 bg-gray-800 rounded-lg p-3 input-glow"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
};