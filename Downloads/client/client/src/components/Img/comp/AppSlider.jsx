import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import '../comp/App.css';


export default function AppSlider({
  label,
  value,
  defaultValue,
  max,
  min,
  onChange,
}) {
  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <div className="slider-wrapper">
      <p className="slider-label">{label}</p>
      <div className="slider-container">
        <Slider
          onChange={handleChange}
          min={min}
          max={max}
          defaultValue={defaultValue}
          value={value}
          step={0.01}
        />
      </div>
    </div>
  );
}
