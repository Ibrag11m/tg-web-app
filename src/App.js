import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
function App() {
  const {onToggleButton, tg} = useTelegram();

	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [photos,setPhotos] = useState([]);
	const [selected,setSelected] = useState('');
	const [selectedids,setSelectedids] = useState('');
	const [appids, setAppids] = useState(51722498);
	const [apped, setApped] = useState(null);
	const [limit, setLimit] = useState(false);
	const [arr, setArr] = useState(null);
	const [group_link, setGroup_link] = useState("");
	const [textphoto, setTextphoto] = useState("");
	const [textcaption, setTextcaption] = useState("");
	const [result,setPhPh]= useState(null);
	const [parama,setParama]= useState(null);
	const [resultok,setresultok]= useState(0);
	const [adsok,setadsok]= useState(0);
	const [starte, setStarte] = useState(2);
	const [dopgen, setDopgen] = useState(0);
	const [qq, setqq] = useState(null);
	const [step, setStep] = useState(6);
	const [residd, setResid] = useState(null);
	const [strhash, setStrhash] = useState(null);
	const [gettask, setGettask] = useState(true);
	const [getwork, setGetwork] = useState(false);
	const [photos_, setPhotos_] = useState(null);
	const [scrollTops, setScrollTops] = useState(0);
	const [actives, setactives] = useState(0);
	const [resp_method, setResp_method] = useState(1);

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
    let arr = [];
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
      <button onclick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
