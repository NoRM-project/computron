import React from 'react'
import Bit from './RegisterBit';
import NumberInput from './NumberInput';

type WordSelectorProps = {
    wordType: 'cpu' | 'memory';
    currentValue: number;
    onValueChange: (newValue: number) => void;
}

function decimalTo16BitArray(value: number): boolean[] {
  if (!Number.isInteger(value)) {
    throw new Error(`Value must be an integer, got ${value}`);
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
        true,
        false, false, false,
        true, true, true,
        false, false, false,
        true, true, true,
        false, false, false
    ];
    return wordType === 'cpu' ? (colors[position] ? 'orange' : 'green') : (colors[position] ? 'blue' : 'red')
}

const WordSelector: React.FC<WordSelectorProps> = ({wordType, currentValue, onValueChange}) => {

    const bitStates = decimalTo16BitArray(currentValue);
 
    const changeBit = function(bit: number) {
        const nextBits = [...bitStates];
        nextBits[bit] = !nextBits[bit];
        onValueChange(bitArray16ToDecimal(nextBits));
    };

    return (
      <div className='word-selector'>
        <div className='word-selector-bits'>
            {bitStates.map((active, i) => (
                <Bit color={getColor(wordType, i)} turnedOn={active} onClick={() => changeBit(i)}/>
            ))}
        </div>
        <div className='number-input-container'>
          <div className='number-input-title'>{wordType === 'cpu' ? 'CPU' : 'Memory'}</div>
          <NumberInput currentValue={currentValue} onValueChange={onValueChange}/>
        </div>
      </div>
    );
};

export default WordSelector;