import { useState, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
function App() {
  const {onToggleButton, tg} = useTelegram();

	const [photos,setPhotos] = useState([]);

useEffect(() => {
  tg.ready();
  async function fetchData() {
    const rawResponse = await fetch('https://xx10.ru/photo2/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({type:"get", gen:1, linkhash:''})
    });
    const content = await rawResponse.json();
    const n1 = Math.trunc(content[0].photos.length / 4) + (content[0].photos.length % 4 ? 1 : 0);
    const n2 = Math.trunc(content[1].photos.length / 4) + (content[1].photos.length % 4 ? 1 : 0);
    const n = Math.max(n1, n2);
    const a = [{name: content[0].name, path: content[0].path, photos: []}];
    for (let i = 0; i < n; i++) {
      const j = 4 * i;
      a[0].photos.push(...content[0].photos.slice(j, j + 4));
      a[0].photos.push(...content[1].photos.slice(j, j + 4));
    }
    return a;
  }
  fetchData().then((content)=>{
    setPhotos(content);
  });
}, [tg])


  return (
    <div className="App">
      <Header />
      {photos}
      <button onclick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
