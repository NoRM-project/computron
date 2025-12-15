import { useState, useRef, useEffect } from "react";
import "../menu.css";

export type MenuItemConfig =
    | { type: "item"; label: string; onClick: () => void }
    | { type: "divider" };

interface MenuProps {
    label: string;
    items: MenuItemConfig[];
}

export default function DropdownMenu({ label, items }: MenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (action: () => void) => {
        action();
        setOpen(false);
    };

    return (
        <div className="dropdown" ref={menuRef}>
            <button className="dropdown-button" onClick={handleToggle}>
                {label}
            </button>

            {open && (
                <div className="dropdown-menu">
                    {items.map((item, index) => {
                        if (item.type === "divider") {
                            return <div key={index} className="dropdown-divider" />;
                        }

                        return (
                            <div
                                key={index}
                                className="dropdown-item text-font"
                                onClick={() => handleItemClick(item.onClick)}
                            >
                                {item.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
