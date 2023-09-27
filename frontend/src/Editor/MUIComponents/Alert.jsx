import React, { useState, useEffect } from 'react';
import { Alert as MUIAlert, AlertTitle } from '@mui/material';

export const Alert = function Alert({ properties, styles, registerAction, setExposedVariable, dataCy, fireEvent }) {
  const [severity, setSeverity] = useState();
  const [title, setTitle] = useState(() => computeText());
  const [text, setText] = useState(() => computeText());
  const [visibility, setVisibility] = useState(styles.visibility);
  const [variant, setVariant] = useState();

  useEffect(() => {
    if (visibility !== styles.visibility) setVisibility(styles.visibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles.visibility]);

  useEffect(() => {
    if (severity !== properties.severity) setSeverity(properties.severity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.severity]);

  useEffect(() => {
    if (variant !== properties.variant) setVariant(properties.variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.variant]);

  useEffect(() => {
    setTitle(properties.title);
    setExposedVariable('title', title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.title]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const text = computeText();
    setText(text);
    setExposedVariable('text', text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.text]);

  registerAction(
    'setText',
    async function (text) {
      setText(text);
      setExposedVariable('text', text);
    },
    [setText]
  );
  registerAction(
    'visibility',
    async function (value) {
      setVisibility(value);
    },
    [setVisibility]
  );

  function computeText() {
    return properties.text === 0 || properties.text === false ? properties.text?.toString() : properties.text;
  }

  const computedStyles = {
    display: visibility ? 'flex' : 'none',
    boxShadow: styles.boxShadow,
  };

  console.log('variant', variant);

  return (
    <div data-cy={dataCy}>
      <MUIAlert
        severity={severity}
        variant={variant}
        style={computedStyles}
        onClick={() => {
          fireEvent('onClick');
        }}
        onMouseOver={() => {
          fireEvent('onHover');
        }}
      >
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {text}
      </MUIAlert>
    </div>
  );
};
