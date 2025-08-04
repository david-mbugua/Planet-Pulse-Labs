'use client';

interface MarketPrice {
  crop: string;
  price: string;
}

interface MarketPricesProps {
  prices: MarketPrice[];
  loading?: boolean;
}

export default function MarketPrices({ prices, loading = false }: MarketPricesProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Market Prices</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {loading ? (
          <div className="col-span-full text-center">Loading market prices...</div>
        ) : (
          prices.map((item, index) => (
            <div key={index} className="bg-blue-100 rounded p-2 flex flex-col items-center">
              <span className="font-bold">{item.crop}</span>
              <span>{item.price}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}