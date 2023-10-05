import React, { useRef, useState, useEffect } from 'react';
import { SubCustomDragLayer } from '../SubCustomDragLayer';
import { SubContainer } from '../SubContainer';
import Spinner from '@/_ui/Spinner';
import { Card } from 'antd';

export const Container = function Container({
  id,
  component,
  width,
  height,
  containerProps,
  removeComponent,
  styles,
  darkMode,
  dataCy,
  properties,
  setExposedVariable,
}) {
  const { visibility, disabledState, borderRadius, borderColor, boxShadow } = styles;
  const [title, setTitle] = useState();
  const [showAsCard, setShowAsCard] = useState(false);
  const backgroundColor =
    ['#fff', '#ffffffff'].includes(styles.backgroundColor) && darkMode ? '#232E3C' : styles.backgroundColor;
  const computedStyles = {
    backgroundColor,
    borderRadius: borderRadius ? parseFloat(borderRadius) : 0,
    border: `1px solid ${borderColor}`,
    height,
    display: visibility ? 'flex' : 'none',
    overflow: 'hidden auto',
    position: 'relative',
    boxShadow,
  };

  useEffect(() => {
    setTitle(properties.title);
    setExposedVariable('title', title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.title]);

  useEffect(() => {
    setShowAsCard(properties.showAsCard);
    setExposedVariable('showAsCard', showAsCard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.showAsCard]);

  const parentRef = useRef(null);

  return (
    <Card
      title={title}
      bodyStyle={computedStyles}
    >
      <div
        data-disabled={disabledState}
        className={`jet-container ${properties.loadingState && 'jet-container-loading'}`}
        id={id}
        data-cy={dataCy}
        ref={parentRef}
        // style={computedStyles}
        onClick={(e) => {
          if (e.target.className === 'real-canvas') containerProps.onComponentClick(id, component);
        }} //Hack, should find a better solution - to prevent losing z index when container element is clicked
      >
        {properties.loadingState ? (
          <Spinner />
        ) : (
          <>
            <SubContainer
              parentComponent={component}
              containerCanvasWidth={width}
              parent={id}
              {...containerProps}
              parentRef={parentRef}
              removeComponent={removeComponent}
            />
            <SubCustomDragLayer
              containerCanvasWidth={width}
              parent={id}
              parentRef={parentRef}
              currentLayout={containerProps.currentLayout}
            />
          </>
        )}
      </div>
    </Card>
  );
};
