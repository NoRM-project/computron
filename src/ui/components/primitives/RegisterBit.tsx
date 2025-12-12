import React from "react";

type RegisterBitProps = {
    color: "red" | "blue" | "orange" | "green";
    turnedOn: boolean;
};

const GRADIENTS = {
    red: {
        on:  { c1: "#FE874A", c2: "#E7191F" },
        off: { c1: "#670003", c2: "#933200" }
    },
    blue: {
        on:  { c1: "#55D2E0", c2: "#0D99FF" },
        off: { c1: "#00206B", c2: "#006C78" }
    },
    orange: {
        on:  { c1: "#FED158", c2: "#FFA629" },
        off: { c1: "#885000", c2: "#876201" }
    },
    green: {
        on:  { c1: "#00BF63", c2: "#009D8D" },
        off: { c1: "#00341B", c2: "#005B52" }
    }
} as const;

const RegisterBit: React.FC<RegisterBitProps> = ({ color, turnedOn }) => {
    const state = turnedOn ? "on" : "off";
    const { c1, c2 } = GRADIENTS[color][state];

    return (
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="23" height="23" fill="url(#paint0_radial_110_1455)"/>
            <defs>
                <radialGradient id="paint0_radial_110_1455" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.5 11.5) rotate(90) scale(11.5)">
                    <stop stop-color={c1}/>
                    <stop offset="1" stop-color={c2}/>
                </radialGradient>
            </defs>
        </svg>
    );
};

export default RegisterBit;