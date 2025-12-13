import React from 'react'
import Bit from './RegisterBit';

type NumberInputProps = {
    currentValue: number;
    onValueChange: (newValue: number) => void;
}

const MAX_U16 = 65535;

const toOctal = (v: number) => v.toString(8);
const fromOctal = (s: string) => parseInt(s, 8);
const clampU16 = (v: number) =>
  Math.min(Math.max(v, 0), MAX_U16);

const NumberInput: React.FC<NumberInputProps> = ({currentValue, onValueChange}) => {


    return (
        <div className='number-input'>
            <button
                className='number-input-button number-input-button-left'
                onClick={() => onValueChange(currentValue - 1)}
                disabled={currentValue === 0}
            >
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.11316 7.3931C7.11316 8.17854 6.24921 8.65738 5.58316 8.2411L0.469955 5.04535C-0.156713 4.65368 -0.156712 3.74102 0.469956 3.34935L5.58316 0.153601C6.24921 -0.26268 7.11316 0.216164 7.11316 1.0016V7.3931Z" fill="white"/>
                </svg>
            </button>
            <input
                value={toOctal(currentValue)}
                type="text"
                inputMode="numeric"
                className="number-input-field"
                onChange={(e) => {
                    const v = e.target.value;

                    if (v === "") {
                        onValueChange(0);
                        return;
                    }

                    if (!/^[0-7]+$/.test(v)) return;

                    const parsed = fromOctal(v);
                    onValueChange(clampU16(parsed));
                }}
            />
            <button
                className='number-input-button number-input-button-right'
                onClick={() => onValueChange(currentValue + 1)}
                disabled={currentValue === MAX_U16}
            >
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 7.3931C0 8.17854 0.863951 8.65738 1.53 8.2411L6.6432 5.04535C7.26987 4.65368 7.26987 3.74102 6.6432 3.34935L1.53 0.153601C0.86395 -0.26268 0 0.216164 0 1.0016V7.3931Z" fill="white"/>
                </svg>
            </button>
        </div>
    );
};

export default NumberInput;