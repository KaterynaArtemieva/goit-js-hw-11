import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const target = document.querySelector('.guard');
let searchImg = '';
let currentPage = 1;
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let instance = null;
form.addEventListener('submit', onFormSubmit);
function onFormSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  let currentPage = 1;
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  searchImg = searchQuery.value.trim();
  if (searchImg) {
    fetchImages(searchImg, currentPage)
      .then(data => {
        if (data.total) {
          gallery.insertAdjacentHTML('beforeend', createMarkup(data));
          Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
          let observer = new IntersectionObserver(onLoad, options);
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
function onLoad(entries, observer, searchImg) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      const {
        elements: { searchQuery },
      } = form;
      searchImg = searchQuery.value.trim();
      if (searchImg) {
        console.log(searchImg);
        fetchImages(searchImg, currentPage)
          .then(data => {
            gallery.insertAdjacentHTML('beforeend', createMarkup(data));
            const { height: cardHeight } = document
              .querySelector('.gallery')
              .firstElementChild.getBoundingClientRect();
            window.scrollBy({
              top: cardHeight * 2,
              behavior: 'smooth',
            });
            let totalPageImg = 40 * currentPage;
            if (totalPageImg >= data.total) {
              observer.unobserve(target);
              Notiflix.Notify.info(
                "We're sorry, but you've reached the end of search results."
              );
            }
          })
          .catch(err => console.log(err));
      }
    }
  });
}
function createMarkup(data) {
  let arr = data.hits;
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div></a>
    </div>
  `
    )
    .join('');
}
function err(error) {
  Notiflix.Notify.failure(`${error.message}`);
}
