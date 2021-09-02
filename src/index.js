import './sass/main.scss';
import markupCards from './markupphotocardstemplate.hbs';
import { error,   defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
import refs from './defaultform.js';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const KEY_API = '23178316-240d542cb1c8ade8461e6b140';
const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
let page = 1;
let searchValue = '';


const handlerSearch = e => {
  e.preventDefault();

  if (searchValue === refs.input.value) return;

  searchValue = refs.input.value;

  fetch(`${BASE_URL}&q=${searchValue}&page=${page}&per_page=12&key=${KEY_API}`)
    .then(response => response.json())
    .then(photo => {
      if (photo.hits.length === 0) {
        return error({
          text: 'Please specify the request',
          delay: 500,
        });
      } else {
        clearGallery();
        renderPhoto(photo.hits);
      }
    })
    .then(() => page++)
    .then(clearInput)
    .catch(err => {
      defaultModules.set(PNotifyMobile, {});
      clearGallery();
      error({
          text: 'Nothing found',
          delay: 1000,
      });
    });
};

function loadMore(e) {
  e.preventDefault();

  fetch(`${BASE_URL}&q=${searchValue}&page=${page}&per_page=12&key=${KEY_API}`)
    .then(response => response.json())
    .then(photo => {
      if (photo.hits.length === 0) {
        return error({
          text: 'No more images',
          delay: 2000,
        });
      } else {
        renderPhoto(photo.hits);
      }
    })
    .then(() => page++)
    .then(() => loadMoreImages())
    .catch(err => {
      defaultModules.set(PNotifyMobile, {});
      clearGallery();
      error({
        text: 'Nothing found',
      });
    });
}

function loadMoreImages() {
  try {
    let top = window.scrollY + window.innerHeight;

    setTimeout(() => {
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }, 200);
  } catch (error) {
    clearGallery();
    console.log(error);
  }
}

refs.form.addEventListener('submit', handlerSearch);
refs.loadMore.addEventListener('click', loadMore);


function modalWindow(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'IMG') {
      return;
    }
    const imgSrc = e.target.src;
    const instance = basicLightbox.create(`<img src=${imgSrc} width="800" height="600">`);
    instance.show();
}
  

function renderPhoto(photo) {
  refs.gallery.insertAdjacentHTML('beforeend', markupCards(photo));
  refs.loadMore.classList.replace('load-more_hide', 'load-more_visible');
  refs.gallery.addEventListener('click', modalWindow);
}


function clearGallery() {
  refs.gallery.innerHTML = '';
}


function clearInput() {
  refs.input.value = '';
}