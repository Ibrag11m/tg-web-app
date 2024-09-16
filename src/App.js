import { useState, useEffect, useRef } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import $ from "jquery";
import sad from "./img/sad.png";
import kllss from "./img/klass.png";
import loadimg from "./img/loadimg.gif";

//import PropTypes from 'prop-types';
const LINK_FOR_TG = "https://t.me/share/url?url=";
const LINK = "https://t.me/moy_obraz";
const CHANEL_ID = "@moy_obraz";
const BACKEND_URL = "https://xs9.ru";
const LINK_FOR_APP = "https://t.me/my_vot_photo_bot";

const App = () => {
  const {onToggleButton, tg, photo_user} = useTelegram();

	const [photos,setPhotos] = useState([]);
  const [activeTab,setActiveTab] = useState(0);
  const [showedPhotos, setShowedPhotos] = useState([]);
  const [showedPhotosConfigs, setShowedPhotosConfigs] = useState([]);
  const [photos_, setPhotos_] = useState(null);
  const [showbtn, setShowbtn] = useState(true);
  const [scrollBottom,setScrollBottom] = useState(false);
  const [scrollTops, setScrollTops] = useState(0);
  const [xelemids, setXelemids] = useState(0);
  const [actives, setactives] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedurl, setSelectedurl] = useState('');
  const [result,setPhPh]= useState(null);
	const scrollBottomRef = useRef();
  const [disabled1, setDisabled1] = useState(false);
	const [disabled2, setDisabled2] = useState(false);
	scrollBottomRef.current = scrollBottom;
  const defaultLink = "https://xx10.ru/photo2/images";
  let showbtnarr = [];
  let loadings = false;
  let listedslide = true;
  let textprogress = "";

  const [userAvatar, setUserAvatar] = useState(null);
  const [user, setUser] = useState(null);

  const GetUserAvatar = async () => {
    try {
      const id = user?.id;
      
      const resp = await fetch(
        `${BACKEND_URL}/api/user_avatar?user_id=${id}`,
      );
      const data = await resp.json();

      if(data.status === "success") setUserAvatar(data.photo_url);
    } catch(e) {
      console.error(e);
      //alert("Произошла ошибка, при получении аватарки пользователя");
    };
  };

  const Share = () => {
    window.open(
      `${LINK_FOR_TG}${LINK_FOR_APP}`, 
      "_blank",
    );
  };
  

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
  });
}, [tg])

useEffect(() => {
  if (photos.length > 0) {
    let arrs2 = JSON.parse(JSON.stringify(photos));
    for(let i=0;i<photos.length;i++)
    {
      arrs2[i].photos = photos[i].photos.slice(0, photos[i].photos.length >= 8 ? 8 : photos[i].photos.length);
      shuffle(arrs2[i].photos);
      setXelemids(1);
      showbtnarr[i] = true;
    }
    //arrs2[0] = arrs2[0].concat(arrs2[1]);
    setPhotos_(arrs2);
  }
}, [photos])  



const select =(url,ids) =>{
  setSelectedurl(url);
  setactives(1);
  setStep(2);
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
      let activePhotos = photos_[activeTab].photos;
      addImages(photos_[activeTab].path, activePhotos);
  }
},[photos_])
/*useEffect(()=>{
  console.log(window.Telegram.WebApp.viewportStableHeight)
},[window.Telegram.WebApp.viewportStableHeight])*/
useEffect(()=>{
  setUser(window.Telegram.WebApp.initDataUnsafe.user);
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

useEffect(() => {
  GetUserAvatar();
}, [user]);

const loaded = () => {
  let tek = [];
  loadings = true;
  let xelemidss = xelemids+1;
  setXelemids(xelemidss);
  tek = photos[activeTab].photos.slice(xelemidss*8-8, photos[activeTab].photos.length >= 8*xelemidss ? 8*xelemidss : photos[activeTab].photos.length);
  shuffle(tek);
  photos_[activeTab].photos = [...photos_[activeTab].photos, ...tek];
  addImages(photos[activeTab].path,tek,true);
    if(photos_[activeTab].photos.length < 8 * xelemidss) {
      setShowbtn(false);
      showbtnarr[activeTab] = false;
    }
    setScrollBottom(false);
    loadings = false;
  }

  const onSelectImageHandler2 = (event) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('photos', file);
    formData.append('gen', '1');
    formData.append('sha', btoa(selectedurl));
		textprogress = 'Загружаем фото... Это не долго';
    setStep(1);
		fetch("https://xx10.ru/photo2/gen_tg.php", {
			method: 'POST',
			body: formData,
		  }).then(res=>res.json()).then((server)=> {
			if(server.hasOwnProperty("error")){
				setPhPh("Error");
				setStep(5);
			}else{
				setPhPh(server.result);
        setStep(3);
			}
		  }).catch((err) => {
			  setPhPh("Error");
        setStep(5);
		  });
	}

  const podpis = () => {
    window.open(
      LINK, 
      "_blank",
    );
	}

  const check_podpis = async () => {
		try {
      const id = user?.id;
      const resp = await fetch(
        `${BACKEND_URL}/api/check_subscribe?user_id=${id}&chat_id=${CHANEL_ID}`,
      );
      const data = await resp.json();

      if(data.status !== "success") throw new Error(data.msg);
      else if(data.is_subscribe) setStep(4);
      else alert("Пожалуйста, подпишитесь на канал чтобы продолжить");
    } catch(e) {
      console.error(e);
      alert("Произошла ошибка, при проверке подписки на канал");
    };
	}

  if(actives === 1){
    return (
      <div className="step-2">
      {step === 1 &&
          <div className="fle" style={{rowGap:40,justifyContent:"center",flexBasis:"90%"}}>
            <img src={loadimg} className={"kl-i"} />
            <span style={{maxWidth: 400,textAlign:"center",whiteSpace: 'pre-line'}} level={"2"}>
              Загружаем фото...
              Это не долго
            </span>
          </div>
      }
      {step === 2 &&
        <div><div style={{ justifyContent: "center" }} className={"fle"}>
            <img src={selectedurl} className={"kl-i"} />
          </div>
            <div className="fle" style={{ rowGap: 20, justifyContent: "flex-start" }}>
              <span style={{ maxWidth: 400 }} level={"2"}>
                Какое фото использовать для этого образа?
              </span>
              <div className="buttons">
                <div class="input__wrapper">
                  <input name="file" type="file" id="input__file" class="input input__file" onChange={onSelectImageHandler2}  accept="image/*,.png,.jpg,.gif,.web,.heic"/>
                  <label for="input__file" class="input__file-button">
                      <span class="input__file-button-text">Загрузить с телефона</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
      }
      {step === 3 &&
        <div>
          <div style={{height: 150,boxSizing:"border-box",justifyContent:"center"}} className={"fle"}>
            <img src={kllss} className={"kl-i"}/>
          </div>
          <div className="fle" style={{rowGap:20,justifyContent:"flex-start"}}>
            <span style={{maxWidth: 400}} level={"2"}>
              Подпишитесь на нас чтобы быть в курсе всех событий!
            </span>
            <div className="buttons">
              <button disabled={disabled1} onClick={podpis} className={'cst-but active podpispbt'}>Подписаться</button>
              <button disabled={disabled2} onClick={check_podpis} className={'cst-but active podpispbt'}>Проверить подписку</button>
            </div>
          </div>
        </div>
      }
      {step === 4 &&
          <div><div className="fle" style={{ justifyContent: "center" }}>
            <img src={result ? "https://xx10.ru/photo2" + result : "https://xx10.ru/photo2/images/W/1.jpeg"}
              className={"img-last"} />
          </div><div className="fle" style={{ rowGap: 20, justifyContent: "flex-start" }}>
              <span style={{ maxWidth: 400 }} level={"2"}>
                Ваш результат готов. Не забудьте показать результат друзьям!
              </span>
              <button disabled={disabled1} onClick={Share} className={'cst-but active podpispbt'}>Поделиться с друзьями</button>
            </div></div>
      }
      {step === 5 &&
          <div><div style={{ height: 150, boxSizing: "border-box", justifyContent: "center" }} className={"fle"}>
            <img src={sad} className={"kl-i"} />
          </div><div className="fle" style={{ rowGap: 20, justifyContent: "flex-start" }}>
              <span style={{ maxWidth: 400 }} level={"2"}>
                Мы не смогли определить Ваше лицо на фото! Попробуйте использовать другое фото с галереи. Внимание! На фото должно быть 1 лицо в хорошем качестве.
              </span>
              <div className="buttons">
                <div class="input__wrapper">
                  <input name="file" type="file" id="input__file" class="input input__file" onChange={onSelectImageHandler2}  accept="image/*,.png,.jpg,.gif,.web,.heic"/>
                  <label for="input__file" class="input__file-button">
                      <span class="input__file-button-text">Загрузить с телефона</span>
                  </label>
                </div>
                </div>
            </div></div>
      }
      </div>
    )

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
