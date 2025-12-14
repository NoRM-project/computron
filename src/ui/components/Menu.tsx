import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './menu.css';

interface MenuProps {
    label: string;
    items: string[];
}

function DropdownMenu({ label, items }: MenuProps) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => setOpen((prev) => !prev);

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as Node)) return;
        setOpen(false);
    };

    const handleItemClick = (item: string) => {
        console.log(`${label} -> ${item}`);
        setOpen(false);
    };

    return (
        <div className="menu-container">
            <Button ref={anchorRef} onClick={handleToggle} className="menu-button" color="inherit">
                {label}
            </Button>
            <Popper open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    placement="bottom-start"
                    style={{ zIndex: 1300 }}>
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper className="popup-paper">
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {items.map((item, index) =>
                                        item === 'divider' ? (
                                            <Divider key={index} className="popup-divider" />
                                        ) : (
                                            <MenuItem
                                                key={index}
                                                className="popup-menu-item"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <ListItemText>{item}</ListItemText>
                                            </MenuItem>
                                        )
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export default function MenuBar() {
    return (
        <div className="menu-bar">
            <DropdownMenu label="File" items={['New', 'Open', 'divider', 'Save', 'Save as', 'divider', 'Exit']} />
            <DropdownMenu label="Settings" items={['Preferences', 'Theme', 'divider', 'Extensions']} />
            <DropdownMenu label="View" items={['Zoom In', 'Zoom Out', 'Full Screen']} />
            <DropdownMenu label="Help" items={['Documentation', 'Check for Updates', 'About']} />
        </div>
    );
}
