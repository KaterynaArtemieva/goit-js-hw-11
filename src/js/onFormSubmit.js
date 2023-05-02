import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import { createMarkup } from './createMarkup';
import { onLoad } from './onLoad';
import { err } from './err';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const target = document.querySelector('.guard');
let searchImg = '';
let observer = null;
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let instance = null;
const form = document.querySelector('.search-form');

export function onFormSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  currentOnLoadPage = 1;
  currentPage = 1;
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  searchImg = searchQuery.value.trim();
  if (observer) {
    observer.unobserve(target);
  }
  if (searchImg) {
    fetchImages(searchImg, currentPage)
      .then(data => {
        if (data.total) {
          gallery.insertAdjacentHTML('beforeend', createMarkup(data));
          Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
          observer = new IntersectionObserver(onLoad, options);
          observer.observe(target);
          if (instance) {
            instance.refresh();
          } else {
            instance = new SimpleLightbox('.gallery a');
          }
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          const {
            elements: { searchQuery },
          } = form;
          searchQuery.value = '';
        }
      })
      .catch(err);
  }
}
