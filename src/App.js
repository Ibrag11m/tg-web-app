import { useState, useEffect, useRef } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import $ from "jquery";
//import PropTypes from 'prop-types';
function App() {
  const {onToggleButton, tg} = useTelegram();

	const [photos,setPhotos] = useState([]);
  const [activeTab,setActiveTab] = useState(0);
  const [showedPhotos, setShowedPhotos] = useState([]);
  const [showedPhotosConfigs, setShowedPhotosConfigs] = useState([]);
  const [photos_, setPhotos_] = useState(null);
  const [showbtn, setShowbtn] = useState(true);
  const [scrollBottom,setScrollBottom] = useState(false);
  const [scrollTops, setScrollTops] = useState(0);
	const scrollBottomRef = useRef();
	scrollBottomRef.current = scrollBottom;
  const defaultLink = "https://xx10.ru/photo2/images";
  let showbtnarr = [];
  let xelemids = [];
  let loadings = false;
  let listedslide = true;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

useEffect(() => {
  tg.ready();
  setActiveTab(0);
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
    console.log('content');
    console.log(content);
  });
}, [tg])

useEffect(() => {
  if (photos.length > 0) {
    let arrs2 = JSON.parse(JSON.stringify(photos));
    for(let i=0;i<photos.length;i++)
    {
      arrs2[i].photos = photos[i].photos.slice(0, photos[i].photos.length >= 8 ? 8 : photos[i].photos.length);
      shuffle(arrs2[i].photos);
      xelemids[i] = 1;
      showbtnarr[i] = true;
    }
    console.log('arrs2');
    console.log(arrs2);
    console.log('xelemids');
    console.log(xelemids);
    //arrs2[0] = arrs2[0].concat(arrs2[1]);
    setPhotos_(arrs2);
  }
}, [photos])  



const select =(url,ids) =>{
  setActiveTab(0);
}
const addImages = (path, imgs,append=false) => {
  let columns = 2;
  if(window.innerWidth <= 600){
  columns = 2;
  }else{
  columns = 4;
  }
  let gapBetweenVertical = 5;
  let gapBetweenHorizontal = 5;
  let gapLeft = 10;
  let gapRight = 10;
  let whatMinusFromWidth = gapBetweenVertical*(columns-1)+gapLeft+gapRight;
  let defaultImageWidth = ((window.innerWidth-whatMinusFromWidth)/columns);
  let container = $(`.activeTab-${activeTab} .my-imgs`);
  let left__  = 0;
  if(activeTab > 0)
      left__ = container[0].offsetWidth * activeTab;
  if(!append) {
      container.html("")
  }
  let imgs_elems = append ? showedPhotosConfigs : [];

  let sex = "W";
  imgs.map(x => {
    if(x)
      if(path !== 'none'){
        imgs_elems.push(
          {
            src: path ? `${defaultLink}/${sex}/${path}/${x.name}` : `${defaultLink}/${sex}/${x.name}`,
            aspect: x.aspect,
            id: x.id
          }
        )
      }else{
        imgs_elems.push(
          {
            src: path ? `${defaultLink}/${sex}/${x.name}` : `${defaultLink}/${sex}/${x.name}`,
            aspect: x.aspect,
            id: x.id
          }
        )
      }
  })
  let top = 0;
  let prevImg = append ? showedPhotos[showedPhotos.length-1] : null;
  let imgs_elements = append ? showedPhotos : [];
  //let gap = 50;

  let columnsArr = new Array(columns).fill(0)
  let ik = 0;
  imgs_elems.map((x, k) => {
      if(ik>=columns) {
          columnsArr.map((x,k)=>{
              columnsArr[k] = x+gapBetweenHorizontal;
          })
          ik = 0;
      }
      columnsArr[ik] += defaultImageWidth*x.aspect

      if(append && k < showedPhotos.length) {
          ik++;
          return;
      }
      let img = document.createElement('img');
      img.src = x.src;
      img.className = "img_start";
      img.style.width = defaultImageWidth+"px";
      img.style.left = left__+gapLeft+"px";
img.addEventListener('click', function(){
  select(x.src, x.id);
  return false;
});
      if(prevImg){
          //let rect = prevImg.getBoundingClientRect();
          let left = $(prevImg).position().left+defaultImageWidth+gapBetweenVertical;
          if(k >= columns){
              //rect = imgs_elements[k-(columns)].getBoundingClientRect();
              //let aspect = imgs_elems[k-columns].aspect;
              top = 0;
              for(let i = 1;i<1000;i++){
                  let itr = k-(columns*i);
                  if(itr < 0)
                      break;
                  top += (defaultImageWidth*imgs_elems[k-(columns*i)].aspect)+gapBetweenHorizontal
              }
              if(top === 0){
                  top = (defaultImageWidth*imgs_elems[k-columns].aspect)+gapBetweenHorizontal;
              }
              if(k % columns === 0) {
                  left = $(imgs_elements[k - (columns)]).position().left;
              }
          }
          img.style.top = top+"px"
          img.style.left = left+"px"
      }
      prevImg = img;
      imgs_elements.push(img);
      $(container).append(img);

      ik++;
  })
  setShowedPhotos([...imgs_elements]);
  setShowedPhotosConfigs([...imgs_elems]);

  imgs_elements.map((x,k)=>{
      $(x).addClass("img_transform")
      setTimeout(()=>{
          $(x).addClass("img_end")
      },200)
  })
  let maxHg = columnsArr.max();
  top = parseInt($(imgs_elements[imgs_elements.length-1]).css("top").split("px"));
  //let height = defaultImageWidth * imgs_elems[imgs_elems.length-1].aspect;
  $(container).css({height:maxHg+100});
}
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

useEffect(()=>{
  if(photos_ !== null){
    console.log('photos_');
    console.log(photos_);
      let activePhotos = photos_[activeTab].photos;
      addImages(photos_[activeTab].path, activePhotos);
  }
},[photos_])
useEffect(()=>{
  console.log(window.Telegram.WebApp.viewportStableHeight)
},[window.Telegram.WebApp.viewportStableHeight])
useEffect(()=>{
  $(window).scroll(function(){
    if(window.scrollY > 0){
      setScrollTops(window.scrollY);
    }
    if(window.scrollY + tg.viewportStableHeight >= $(document).height()-30 && !loadings) {
      if(!scrollBottomRef.current){
        if(listedslide){
          setScrollBottom(true);
        }else{
          setTimeout(()=>{
            listedslide = true;
            setScrollBottom(true);
          },200)
        }
      }
    }else{
      if(scrollBottomRef.current){
        setScrollBottom(false);
      }
    }
  } );
},[])

const loaded = () => {
  let tek = '';
  loadings = true;
  xelemids[activeTab]++;
  console.log(xelemids[activeTab]);
  tek = photos[activeTab].photos.slice(xelemids[activeTab]*8-8, photos[activeTab].photos.length >= 8*xelemids[activeTab] ? 8*xelemids[activeTab] : photos[activeTab].photos.length);
  shuffle(tek);
  console.log(tek);
  photos_[activeTab].photos = [...photos_[activeTab].photos, ...tek];
  addImages(photos[activeTab].path,tek,true);
    if(photos_[activeTab].photos.length < 8 * xelemids[activeTab]) {
      setShowbtn(false);
      showbtnarr[activeTab] = false;
    }
    setScrollBottom(false);
    loadings = false;
  }

  return (
    <div className="App">
      {photos_ && photos_.length > 0 && photos_.map((x, k) => {
        if (x.photos.length > 0)
          return activeTab === k ? (
            <div className={`activeTab activeTab-${k}`}><div className="my-imgs"></div></div>
          ) : <div></div>
      })}
      <div className={`app-loader ${loadings ? "" : "hidden-but"}`}><span className="loader-icon"></span></div>
      <button onClick={loaded} className={`cst-but active loadgo ${scrollBottom ? "btncheck" : ""}`}>Загрузить еще</button>
    </div>
  );
}

export default App;
