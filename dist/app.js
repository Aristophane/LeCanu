const languageButton = document.querySelector('#language');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
let language = 'fr';
const translations = [...document.querySelectorAll('[data-en]')].map(element => ({element, fr:element.innerHTML, en:element.dataset.en}));
const placeholders = [...document.querySelectorAll('[data-placeholder-en]')].map(element => ({element, fr:element.placeholder, en:element.dataset.placeholderEn}));
const images = [...document.querySelectorAll('[data-alt-en]')].map(element => ({element, fr:element.alt, en:element.dataset.altEn}));
const formStatus = document.querySelector('#form-status');
const form = document.querySelector('#contact-form');
const dialog = document.querySelector('#photo-dialog');
function closeMenu(){ navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label',language === 'fr' ? 'Ouvrir le menu' : 'Open menu'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',language === 'fr' ? (open ? 'Fermer le menu' : 'Ouvrir le menu') : (open ? 'Close menu' : 'Open menu'));
});
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event => {if(event.key === 'Escape') closeMenu();});
languageButton.addEventListener('click', () => {
  language = language === 'fr' ? 'en' : 'fr';
  document.documentElement.lang = language;
  translations.forEach(({element,fr,en}) => {if(language === 'fr') element.innerHTML=fr; else element.textContent=en;});
  placeholders.forEach(({element,fr,en}) => {element.placeholder=language === 'fr' ? fr : en;});
  images.forEach(({element,fr,en}) => {element.alt=language === 'fr' ? fr : en;});
  languageButton.innerHTML = language === 'fr' ? 'FR <span>/ EN</span>' : 'EN <span>/ FR</span>';
  languageButton.setAttribute('aria-label',language === 'fr' ? 'Switch to English' : 'Passer en français');
  document.querySelector('.brand').setAttribute('aria-label',language === 'fr' ? 'Atelier Desmarchelier – Le Canu, accueil' : 'Atelier Desmarchelier – Le Canu, home');
  navigation.setAttribute('aria-label',language === 'fr' ? 'Navigation principale' : 'Main navigation');
  document.querySelector('.filters').setAttribute('aria-label',language === 'fr' ? 'Filtrer les photographies' : 'Filter photographs');
  document.querySelector('.dialog-close').setAttribute('aria-label',language === 'fr' ? 'Fermer la photographie' : 'Close photograph');
  document.title = language === 'fr' ? 'Atelier Desmarchelier – Le Canu | Luthier & archetier à Lille' : 'Atelier Desmarchelier – Le Canu | Violin & bow making in Lille';
  document.querySelector('meta[name="description"]').content = language === 'fr' ? 'Lutherie et archèterie d’art au cœur de Lille. Fabrication, restauration, réglage et reméchage avec Juliette Desmarchelier et Yannick Le Canu. Sur rendez-vous.' : 'Violin and bow making in Lille. Making, restoration, adjustment and rehairing with Juliette Desmarchelier and Yannick Le Canu. Visits by appointment.';
  formStatus.textContent=''; closeMenu();
});
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click',() => {
  document.querySelectorAll('.filters button').forEach(item => {item.classList.toggle('active',item === button);item.setAttribute('aria-pressed',String(item === button));});
  document.querySelectorAll('.gallery-item').forEach(item => {item.hidden=button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter;});
}));
document.querySelectorAll('.gallery-item').forEach(button => button.addEventListener('click',() => {
  const source=button.querySelector('img');
  const photo=document.querySelector('#photo-large');
  photo.src=source.src;photo.alt=source.alt;
  document.querySelector('#photo-title').textContent=language === 'fr' ? button.dataset.titleFr : button.dataset.titleEn;
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
dialog.addEventListener('click',event => {if(event.target === dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom) dialog.close();}});
document.querySelectorAll('.service-choose').forEach(link => link.addEventListener('click',() => {form.elements.service.value=link.dataset.service;}));
form.addEventListener('submit',event => {
  event.preventDefault();
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const selected=form.elements.service.selectedOptions[0].textContent;
  const subject=encodeURIComponent((language === 'fr' ? 'Demande de rendez-vous — ' : 'Appointment enquiry — ')+selected);
  const body=encodeURIComponent(`${language === 'fr' ? 'Bonjour,' : 'Hello,'}\n\n${data.get('message').trim()}\n\n${language === 'fr' ? 'Nom' : 'Name'} : ${data.get('name').trim()}\nEmail : ${data.get('email').trim()}\n${language === 'fr' ? 'Prestation' : 'Service'} : ${selected}`);
  window.location.href=`mailto:yannick.le-canu@wanadoo.fr?subject=${subject}&body=${body}`;
  formStatus.textContent=language === 'fr' ? 'Votre e-mail est préparé. Envoyez-le depuis votre messagerie. Si elle ne s’ouvre pas, appelez-nous ou utilisez l’adresse ci-dessous.' : 'Your email is ready. Send it from your email application. If it does not open, call us or use the address below.';
});
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.1});
  document.querySelectorAll('.section-heading,.craft-item,.atelier-copy,.service-block,.collection-heading,.contact-info,.contact-form').forEach(element=>{element.classList.add('reveal');observer.observe(element);});
}
