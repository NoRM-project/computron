import Console from "./components/Console"
import FileTabs from "./components/FileTabs"
import Healper from "./components/Helper"
import Memory from "./components/Memory"
import Menu from "./components/Menu"
import './app.css'

function App() {
  return (
    <>
      <Menu/>
      <div className="application-body">
        <div className="file-console-container">
          <FileTabs/>
          <Console/>
        </div>
        <Healper/>
        <Memory/>
      </div>
    </>
  )
}

export default App
