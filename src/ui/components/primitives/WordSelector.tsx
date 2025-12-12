import React from 'react'
import Bit from './RegisterBit';

type WordSelectorProps = {
    wordType: 'cpu' | 'memory';
    currentValue: number;
    onValueChange: (newValue: number) => void;
}

function decimalTo16BitArray(value: number): boolean[] {
  if (!Number.isInteger(value)) {
    throw new Error('Value must be an integer');
  }

  if (value < 0 || value > 0xffff) {
    throw new Error('Value must fit into 16 bits (0-65535)');
  }

  const bits: boolean[] = [];

  for (let i = 15; i >= 0; i--) {
    bits.push(Boolean((value >> i) & 1));
  }

  return bits;
}

export function bitArray16ToDecimal(bits: boolean[]): number {
  if (bits.length !== 16) {
    throw new Error('Bit array must have exactly 16 elements');
  }

  let value = 0;

  for (let i = 0; i < 16; i++) {
    if (bits[i]) {
      value |= 1 << (15 - i);
    }
  }

  return value;
}

function getColor(wordType: 'cpu' | 'memory', position: number) {
    const colors: boolean[] = [
        true, true, true,
        false, false, false, false,
        false, false, false, false,
        false, false, false, false,
        false,
    ];
    return wordType === 'cpu' ? (colors[position] ? 'orange' : 'green') : (colors[position] ? 'blue' : 'red')
}

const WordSelector: React.FC<WordSelectorProps> = ({wordType, currentValue, onValueChange}) => {

    const bitStates = decimalTo16BitArray(currentValue);
 
    const changeBit = function(bit: number) {
        bitStates[bit] = !bitStates[bit];
        onValueChange(bitArray16ToDecimal(bitStates));
    };

    return (
        <div className='word-selector'>
            {bitStates.map((active, i) => (
                <Bit color={getColor(wordType, i)} turnedOn={active} onClick={() => changeBit(i)}/>
            ))}
        </div>
    );
};

export default WordSelector;