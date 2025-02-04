import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import * as IconsMUI from '@mui/icons-material';
import { Box } from '@mui/material';

export const Icon = ({ properties, styles, fireEvent, width, height, registerAction, darkMode, dataCy, component }) => {
  const { icon } = properties;
  const { iconColor, visibility, boxShadow } = styles;
  // eslint-disable-next-line import/namespace
  const IconElement = IconsMUI[icon];
  const { definition } = component;
  const { events = [] } = definition;

  const color = iconColor === '#000' ? (darkMode ? '#fff' : '#000') : iconColor;

  const [showIcon, setIconVisibility] = useState(true);

  useEffect(() => {
    showIcon !== visibility && setIconVisibility(visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibility]);

  registerAction(
    'setVisibility',
    async function (visibility) {
      setIconVisibility(visibility);
    },
    [setIconVisibility]
  );

  registerAction('click', async function () {
    fireEvent('onClick');
  });

  return (
    <Box data-cy={dataCy}>
      {showIcon && (
        <IconElement
          onClick={(event) => {
            event.stopPropagation();
            fireEvent('onClick');
          }}
          onMouseOver={(event) => {
            event.stopPropagation();
            fireEvent('onHover');
          }}
          stroke={1.5}
          sx={{
            color: color,
            width: width,
            height: height,
            boxShadow: boxShadow,
          }}
        />
      )}
    </Box>
  );
};
