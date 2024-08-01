import { useState, useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import $ from "jquery";
function App() {
  const {onToggleButton, tg} = useTelegram();

	const [photos,setPhotos] = useState([]);
  const [activeTab,setActiveTab] = useState(0);
  const [showedPhotos, setShowedPhotos] = useState([]);
  const [showedPhotosConfigs, setShowedPhotosConfigs] = useState([]);
  const defaultLink = "https://xx10.ru/photo2/images";

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
  });
}, [tg])
const select =(url,ids) =>{
  null;
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
      if(path != 'none'){
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
  let blockHeight = 0;
  let top = 0;
  let prevImg = append ? showedPhotos[showedPhotos.length-1] : null;
  let imgs_elements = append ? showedPhotos : [];
  let gap = 50;

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
          let rect = prevImg.getBoundingClientRect();
          let left = $(prevImg).position().left+defaultImageWidth+gapBetweenVertical;
          if(k >= columns){
              rect = imgs_elements[k-(columns)].getBoundingClientRect();
              let aspect = imgs_elems[k-columns].aspect;
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
  let height = defaultImageWidth * imgs_elems[imgs_elems.length-1].aspect;
  $(container).css({height:maxHg+100});
}


  return (
    <div className="App">
      <Header />
      {photos && photos.length > 0 && photos.map((x, k) => {
        if (x.photos.length > 0)
          return activeTab === k ? (
            <div className={`activeTab activeTab-${k}`}><div className="my-imgs"></div></div>
          ) : <div></div>
      })}
      <button onclick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
