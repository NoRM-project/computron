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
import './FileMenu.css';

export default function FileMenu() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
            return;
        }
        setOpen(false);
    };

    const handleMenuItemClick = (action: string) => {
        console.log(`Clicked ${action}`);
        setOpen(false);
    };

    return (
        <div className="menu-container">
            <Button
                ref={anchorRef}
                onClick={handleToggle}
                className="menu-button"
                color="inherit"
            >
                File
            </Button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper className="popup-paper">
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    <MenuItem className="popup-menu-item" onClick={() => handleMenuItemClick('New')}>
                                        <ListItemText>New</ListItemText>
                                    </MenuItem>
                                    <MenuItem className="popup-menu-item" onClick={() => handleMenuItemClick('Open')}>
                                        <ListItemText>Open</ListItemText>
                                    </MenuItem>
                                    <Divider className="popup-divider" />
                                    <MenuItem className="popup-menu-item" onClick={() => handleMenuItemClick('Save')}>
                                        <ListItemText>Save</ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}
