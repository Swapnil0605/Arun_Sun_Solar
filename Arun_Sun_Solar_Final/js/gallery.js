(() => {
  const cards = [...document.querySelectorAll('.gallery-card')];
  const filters = [...document.querySelectorAll('.gallery-filter')];
  const lightbox = document.querySelector('.gallery-lightbox');
  const media = lightbox.querySelector('.gallery-lightbox-media');
  const image = media.querySelector('img');
  const video = media.querySelector('video');
  const title = document.getElementById('galleryLightboxTitle');
  const location = document.getElementById('galleryLightboxLocation');
  const category = document.getElementById('galleryLightboxCategory');
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    video.pause();
    video.removeAttribute('src');
    video.load();
    media.classList.remove('is-video');
    document.body.style.overflow='';
  };
  let visible = cards.slice();
  let current = 0;
  const show = (i) => {
    if (!visible.length) return;
    current=(i+visible.length)%visible.length;
    const card=visible[current];
    const isVideo=card.dataset.mediaType==='video';
    title.textContent=card.querySelector('h2').textContent;
    location.textContent=card.querySelector('p').textContent;
    category.textContent=card.querySelector('.gallery-caption>span').textContent;
    if (isVideo) {
      image.removeAttribute('src');
      image.alt='';
      video.src=card.dataset.video;
      media.classList.add('is-video');
    } else {
      video.pause();
      video.removeAttribute('src');
      video.load();
      media.classList.remove('is-video');
      const img=card.querySelector('img');
      image.src=img.src;
      image.alt=img.alt;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  cards.forEach(card => card.querySelector('.gallery-open').addEventListener('click',()=>show(visible.indexOf(card))));
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    visible=cards.filter(c=>f==='all'||c.dataset.category===f);
    cards.forEach(c=>c.classList.toggle('hidden',!visible.includes(c)));
    if(current>=visible.length) current=0;
  }));
  lightbox.querySelector('.gallery-close').addEventListener('click',close);
  lightbox.querySelector('[data-close]').addEventListener('click',close);
  lightbox.querySelector('.gallery-prev').addEventListener('click',()=>show(current-1));
  lightbox.querySelector('.gallery-next').addEventListener('click',()=>show(current+1));
  document.addEventListener('keydown',e=>{
    if(!lightbox.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')show(current-1);
    if(e.key==='ArrowRight')show(current+1);
  });
})();
