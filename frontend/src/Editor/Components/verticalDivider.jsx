import React from 'react';
import config from 'config';
import MUIDivider from '@mui/material/Divider';

export const VerticalDivider = function Divider({ styles, height, width, dataCy, darkMode }) {
  const { visibility, dividerColor, boxShadow } = styles;
  const color =
    dividerColor === '' || ['#000', '#000000'].includes(dividerColor) ? (darkMode ? '#fff' : '#000') : dividerColor;

  return (
    <>
      {config.UI_LIB === 'tooljet' && (
        <div
          className="row"
          style={{ display: visibility ? 'flex' : 'none', padding: '0 8px', width, height }}
          data-cy={dataCy}
        >
          <div className="col-6"></div>
          <div
            className="col-6 border-right"
            style={{ height, width: '1px', backgroundColor: color, padding: '0rem', marginLeft: '0.5rem', boxShadow }}
          ></div>
        </div>
      )}
      {config.UI_LIB === 'mui' && (
        <div
          className="row"
          style={{ display: visibility ? 'flex' : 'none', padding: '0 8px', width, height }}
          data-cy={dataCy}
        >
          <div className="col-6"></div>
          <MUIDivider
            className="col-6 border-right"
            style={{ height, width: '1px', backgroundColor: color, padding: '0rem', marginLeft: '0.5rem', boxShadow }}
          ></MUIDivider>
        </div>
      )}
    </>
  );
};
