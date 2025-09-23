'use client';

import { useState } from 'react';

type DataViewerProps = {
  data: any;
  title?: string;
};

export function DataViewer({ data, title = 'Debug Data' }: DataViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='bg-gray-100 border border-gray-300 rounded p-4 my-4 w-full overflow-hidden'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='font-bold text-gray-800'>{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded'
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {isExpanded && (
        <pre className='text-xs overflow-auto max-h-[400px] p-2 bg-white border rounded'>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      {!isExpanded && (
        <div className='flex flex-wrap gap-2 text-xs'>
          {data && typeof data === 'object' ? (
            Object.keys(data).map((key) => (
              <div key={key} className='bg-white p-1 rounded border'>
                {key}:{' '}
                {typeof data[key] === 'object'
                  ? Array.isArray(data[key])
                    ? `Array(${data[key].length})`
                    : 'Object'
                  : String(data[key]).substring(0, 20)}
              </div>
            ))
          ) : (
            <div>No data or non-object data</div>
          )}
        </div>
      )}
    </div>
  );
}
