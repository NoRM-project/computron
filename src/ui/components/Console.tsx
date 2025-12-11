import './console.css'

export default function Console() {
  return (
    <div className="console-container container">
        <div className="console-header">
            <div >
                <button className="collapse-button">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.800049 0.800049L4.80005 4.80005L8.80005 0.800049" stroke="#F5F5F5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                Console
            </div>
            <button className="clean-up">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4.00004H3.33333M3.33333 4.00004H14M3.33333 4.00004L3.33333 13.3334C3.33333 13.687 3.47381 14.0261 3.72386 14.2762C3.97391 14.5262 4.31304 14.6667 4.66667 14.6667H11.3333C11.687 14.6667 12.0261 14.5262 12.2761 14.2762C12.5262 14.0261 12.6667 13.687 12.6667 13.3334V4.00004M5.33333 4.00004V2.66671C5.33333 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31304 1.33337 6.66667 1.33337H9.33333C9.68696 1.33337 10.0261 1.47385 10.2761 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004" stroke="#B3B3B3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div className="console-output">Out</div>
    </div>
  )
}
