"use client";

import "./RangeSlider.scss";
import ReactSlider from "react-slider";
import { useEffect, useState } from "react";
import { spans } from "next/dist/build/webpack/plugins/profiling-plugin";

type Props = {
  onAfterChange: (resultValues: [number, number], thumbIndex: number) => void;
  defaultValue: [number, number];
};
const RangeSlider = (props: Props) => {
  const { onAfterChange, defaultValue } = props;
  const [value, setValue] = useState(defaultValue || [0, 10000]);

  useEffect(() => {
    console.log("new value", defaultValue);
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <div className="relative h-[44px]">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        min={0}
        onAfterChange={onAfterChange}
        max={10000}
        value={defaultValue}
        onChange={(value) => setValue(value)}
        ariaLabel={["Минимальная цена", "Максимальная цена"]}
        ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => <div {...props}></div>}
        minDistance={10}
      />
      <span className="absolute left-[5px] text-dark dark:text-light">
        {value[0]}
      </span>
      <span className="absolute right-[5px] text-dark dark:text-light">
        {value[1]}
      </span>
    </div>
  );
};

export default RangeSlider;
