import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");

form.addEventListener("submit", onFormSubmit);

function onFormSubmit(evt){
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
const searchImg = searchQuery.value.trim();
if(searchImg){
  fetchImages(searchImg)
}



}
