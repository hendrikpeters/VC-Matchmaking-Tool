// CustomTooltip.jsx

import React from "react";
import { format } from "d3-format";

const CustomTooltip = ({ id, indexValue, value, color, formatType }) => {
  // Define the formatTooltipContent function inside the component
  const formatTooltipContent = (value) => {
    if (formatType === "percentage") {
      return `${(value).toFixed(2)}%`;
    } else if (formatType === "millions") {
      if (Math.abs(value) >= 1e9) {
        return `${format(".1f")(value / 1e9)}B`; // Format as XX.XB (Billion)
      } else {
        return `${format(".1f")(value / 1e6)}M`; // Format as XX.XM (Million)
      }
    }
  };

  return (
    <div style={{ color: 'black', background: 'white', padding: '5px', borderRadius: '4px' }}>
      <span style={{ display: 'inline-block', width: '11px', height: '11px', marginRight: '5px', backgroundColor: color }}></span>
      <strong>
        {id} {indexValue && `(${indexValue}):`} {formatTooltipContent(value)}
      </strong>
    </div>
  );
};

export default CustomTooltip;
