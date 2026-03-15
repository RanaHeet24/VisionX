import React from 'react';

const MetricCard = ({ title, value, subtext, subtextColor = 'text-gray-400' }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-colors duration-300">
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {subtext && (
          <span className={`text-sm font-medium ${subtextColor}`}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
