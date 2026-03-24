import React from 'react';

function Logo(): React.JSX.Element {
    return (
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-gray-900">
            TF
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            TaskFlow<span className="text-cyan-400">Pro</span>
          </span>
        </div>
    )
}   

export default Logo;