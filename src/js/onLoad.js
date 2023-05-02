import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import { createMarkup } from './createMarkup';
import { err } from './err';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { currentPage } from './onFormSubmit';

const gallery = document.querySelector('.gallery');
const target = document.querySelector('.guard');
const form = document.querySelector('.search-form');

export function onLoad(entries, observer, searchImg) {

  entries.forEach(entry => {
    if (entry.isIntersecting) {
        currentPage = currentPage + 1;
      const {
        elements: { searchQuery },
      } = form;
      let instance = null;
      searchImg = searchQuery.value.trim();
      fetchImages(searchImg, currentPage)
        .then(data => {
          gallery.insertAdjacentHTML('beforeend', createMarkup(data));
          if (instance) {
            instance.refresh();
          } else {
            instance = new SimpleLightbox('.gallery a');
          }
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
        .catch(err);
    }
  });
}
