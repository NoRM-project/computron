import React, { useState } from 'react'
import './registers.css'
import { useComputron } from '../context/ComputronContext.tsx';
import WordSelector from './primitives/WordSelector';

const Registers: React.FC = () => {

    const { state, setRegister, setMemoryCell } = useComputron();

    const [selectedTab, setSelectedTab] = useState<Register>('pc');

    const registers = ['pc', 'sp', 'a', 'x', 'rh', 'rl'] as const;

    return (
        <div className='registers-container'>
            <div>
                <div className='registers-header'>
                    Registers
                </div>
                <div className='register-tab-list'>
                    {registers.map((reg) => (
                        <div
                            key={reg}
                            className={`register-tab ${
                                selectedTab === reg ? 'register-tab-selected' : ''
                            }`}
                            onClick={() => setSelectedTab(reg)}
                        >
                            {reg.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
            <WordSelector
                wordType='cpu'
                currentValue={state?.[selectedTab] ?? 0}
                onValueChange={(value) => setRegister(selectedTab, value)}
            />
            <WordSelector
                wordType='memory'
                currentValue={state?.memory?.[state?.pc ?? 0] ?? 0}
                onValueChange={(value) => setMemoryCell(value)}
            />
        </div>
    );
};

export default Registers;