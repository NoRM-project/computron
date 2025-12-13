import React, { useId } from "react";

type BitProps = {
    color: "red" | "blue" | "orange" | "green";
    turnedOn: boolean;
    onClick: () => void;
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

const Bit: React.FC<BitProps> = ({ color, turnedOn, onClick }) => {
    const id = useId();
    const state = turnedOn ? "on" : "off";
    const { c1, c2 } = GRADIENTS[color][state];

    return (
        <svg
            onClick={onClick}
            width="23"
            height="23"
            viewBox="0 0 23 23"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient
                    id={id}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(11.5 11.5) rotate(90) scale(11.5)"
                >
                    <stop stopColor={c1} />
                    <stop offset="1" stopColor={c2} />
                </radialGradient>
            </defs>

            <rect width="23" height="23" fill={`url(#${id})`} />
        </svg>
    );
};

export default Bit;