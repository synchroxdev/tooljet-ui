import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import config from 'config';
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/joy';

export const CircularProgressBar = function CircularProgressBar({ height, properties, styles, dataCy }) {
  const { text, progress } = properties;
  const { visibility, color, textColor, textSize, strokeWidth, counterClockwise, circleRatio, boxShadow } = styles;

  const computedStyles = {
    display: visibility ? '' : 'none',
    boxShadow,
  };

  return (
    <>
      {config.UI_LIB === 'mui' && (
        <div style={computedStyles} data-cy={dataCy}>
          <CircularProgressbar
            value={progress}
            text={text}
            styles={{
              root: {
                height: height,
              },
              path: {
                stroke: color,
              },
              text: {
                fill: textColor,
                fontSize: textSize,
              },
            }}
            strokeWidth={strokeWidth}
            counterClockwise={counterClockwise}
            circleRatio={circleRatio}
          />
        </div>
      )}
      {config.UI_LIB === 'x' && (
        <Box style={computedStyles}>
          <CircularProgress
            value={progress}
            determinate
            sx={{
              '& .MuiCircularProgress-progress': {
                stroke: color,
                strokeWidth: strokeWidth,
              },
            }}
          />
        </Box>
      )}
    </>
  );
};
