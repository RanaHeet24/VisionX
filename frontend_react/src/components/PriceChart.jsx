import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No chart data available</div>;

  return (
    <div className="w-full h-80 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Price & Indicators (30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="index" 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis domain={['auto', 'auto']} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
            itemStyle={{ color: '#E5E7EB' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="SMA_7" stroke="#10B981" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="SMA_21" stroke="#F59E0B" strokeWidth={1} dot={false} />
          <Line type="monotone" dataKey="EMA" stroke="#EF4444" strokeWidth={1} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
