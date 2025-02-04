import React, { useEffect, useRef, useState } from 'react';
import SliderMUI from '@mui/joy/Slider';

export const RangeSlider = function RangeSlider({ height, properties, styles, setExposedVariable, fireEvent, dataCy }) {
  const { value, min, max, enableTwoHandle } = properties;
  const { trackColor, handleColor, lineColor, visibility, boxShadow } = styles;
  const sliderRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [rangeValue, setRangeValue] = useState([0, 100]);

  const toArray = (data) => (Array.isArray(data) ? data : [data, max]);
  const singleHandleValue = !enableTwoHandle ? (Array.isArray(value) ? value[0] : value) : 50;
  const twoHandlesArray = enableTwoHandle ? toArray(value) : [0, 100];

  const computedStyles = {
    height,
    display: visibility ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px 2px',
    boxShadow,
  };

  useEffect(() => {
    setSliderValue(singleHandleValue);
    setExposedVariable('value', singleHandleValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleHandleValue]);

  useEffect(() => {
    setRangeValue(twoHandlesArray);
    setExposedVariable('value', twoHandlesArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...twoHandlesArray]);

  useEffect(() => {
    setExposedVariable('value', enableTwoHandle ? twoHandlesArray : singleHandleValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableTwoHandle]);

  const onSliderChange = (value) => {
    setExposedVariable('value', value);
    setSliderValue(value);
  };

  const onRangeChange = (value) => {
    setExposedVariable('value', value);
    setRangeValue(value);
  };

  const rangeStyles = {
    handleStyle: toArray(sliderValue).map(() => {
      return {
        backgroundColor: handleColor,
        borderColor: handleColor,
      };
    }),
    trackStyle: toArray(sliderValue).map(() => {
      return { backgroundColor: trackColor };
    }),
    railStyle: { backgroundColor: lineColor },
  };

  return (
    <div
      style={computedStyles}
      className="range-slider"
      data-cy={dataCy}
    >
      {!enableTwoHandle ? (
        <SliderMUI
          min={min}
          max={max}
          ref={sliderRef}
          value={sliderValue}
          onChange={(event) => onSliderChange(event.target.value)}
          sx={{
            '& .MuiSlider-track': {
              backgroundColor: trackColor,
            },
            '& .MuiSlider-rail': {
              backgroundColor: lineColor,
            },
            '& .MuiSlider-thumb': {
              '--Slider-thumbColor': handleColor,
              backgroundColor: handleColor,
              borderColor: handleColor,
            },
          }}
          orientation="horizontal"
          valueLabelDisplay="auto"
          variant="solid"
        />
      ) : (
        <SliderMUI
          min={min}
          max={max}
          ref={sliderRef}
          onChange={(event) => onRangeChange(event.target.value)}
          value={toArray(rangeValue)}
          sx={{
            '& .MuiSlider-track': {
              backgroundColor: trackColor,
            },
            '& .MuiSlider-rail': {
              backgroundColor: lineColor,
            },
            '& .MuiSlider-thumb': {
              '--Slider-thumbColor': handleColor,
              backgroundColor: handleColor,
              borderColor: handleColor,
            },
          }}
          orientation="horizontal"
          valueLabelDisplay="auto"
          variant="solid"
        />
      )}
    </div>
  );
};
