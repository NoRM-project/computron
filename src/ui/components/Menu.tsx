// import { useState } from 'react';
import './menu.css';
import FileMenu from "./menu/FileMenu.tsx";

// export default function Menu() {
//     const [fileOpen, setFileOpen] = useState(false);
//
//     const toggleFileMenu = () => {
//         setFileOpen(!fileOpen);
//     };
//
//     return (
//         <div className="menu-bar">
//             <div className="menu-item">
//                 <button onClick={toggleFileMenu}>File</button>
//
//                 {fileOpen && (
//                     <div className="popup-menu">
//                         <div className="popup-item">New</div>
//                         <div className="popup-item">Open</div>
//                         <div className="popup-item">Save</div>
//                         <div className="popup-item">Exit</div>
//                     </div>
//                 )}
//             </div>
//
//             <button>Settings</button>
//             <button>View</button>
//             <button>Help</button>
//         </div>
//     );
// }


export default function MenuBar() {
    return (
        <div>
            <FileMenu />
            <button>Settings</button>
            <button>View</button>
            <button>Help</button>
        </div>
    );
}
