import DropdownMenu from "./primitives/DropdownMenu.tsx";
import {useComputron} from "../api/ComputronContext.tsx";


export default function MenuBar() {
    const { openFile, newFile, saveFile, saveFileAs, closeFile, activeFile } = useComputron();

    return (
        <div className="menu-bar">
            <DropdownMenu
                label="File"
                items={[
                    {
                        type: "item",
                        label: "New",
                        onClick: () => newFile('undefined.txt'),
                    },
                    {
                        type: "item",
                        label: "Open",
                        onClick: () => openFile(),
                    },
                    { type: "divider" },
                    {
                        type: "item",
                        label: "Save",
                        onClick: () => saveFile(),
                    },
                    {
                        type: "item",
                        label: "Save as",
                        onClick: () => saveFileAs(),
                    },
                    { type: "divider" },
                    {
                        type: "item",
                        label: "Close",
                        onClick: () => activeFile ? closeFile(activeFile) : null,
                    },
                ]}
            />
            <DropdownMenu
                label="Settings"
                items={[
                    {
                        type: "item",
                        label: "Preferences",
                        onClick: () => console.log("Preferences"),
                    },
                    {
                        type: "item",
                        label: "Theme",
                        onClick: () => console.log("Theme"),
                    },
                    { type: "divider" },
                ]}
            />
            <DropdownMenu
                label="View"
                items={[
                    {
                        type: "item",
                        label: "Zoom In",
                        onClick: () => console.log("Zoom In"),
                    },
                    {
                        type: "item",
                        label: "Zoom Out",
                        onClick: () => console.log("Zoom Out"),
                    },
                    {
                        type: "item",
                        label: "Full Screen",
                        onClick: () => console.log("Full Screen"),
                    },
                ]}
            />
            <DropdownMenu
                label="Help"
                items={[
                    {
                        type: "item",
                        label: "Documentation",
                        onClick: () => console.log("Documentation"),
                    },
                    {
                        type: "item",
                        label: "Check for Updates",
                        onClick: () => console.log("Check for Updates"),
                    },
                    {
                        type: "item",
                        label: "About",
                        onClick: () => console.log("About"),
                    },
                ]}
            />

        </div>
    );
}
