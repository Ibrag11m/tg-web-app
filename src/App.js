import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
function App() {
  const {onToggleButton} = useTelegram();
  
  useEffect(() => {
    tg.ready();
  }, [])


  return (
    <div className="App">
      <button onclick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
