export default function TrendingItems() {
  return (
    <div className='mt-4 rounded-xl bg-gray-900 p-4'>
      <h2 className='mb-4 text-xl font-bold'>Trending in Web3</h2>
      <TrendingItem tag='web3' subtitle='Trending with Lens' />
      <TrendingItem
        tag='lens'
        subtitle='Gittiğiniz her yerde hayata özgürce dokunmanız için!'
        promoted='Deep Fresh Türkiye'
      />
      <TrendingItem tag='aitutors' subtitle='9,042 pills' promoted='xxx' />
    </div>
  );
}

const TrendingItem = ({
  tag,
  subtitle,
  promoted,
}: {
  tag: string;
  subtitle: string;
  promoted?: string;
}) => {
  return (
    <div className='cursor-pointer py-2 hover:bg-gray-800'>
      <p className='text-sm text-gray-500'>#{tag}</p>
      <p className='text-sm'>{subtitle}</p>
      {promoted && (
        <p className='text-xs text-gray-500'>Promoted by {promoted}</p>
      )}
    </div>
  );
};
