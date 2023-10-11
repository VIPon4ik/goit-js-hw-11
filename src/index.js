'use strict';

import { gettingApiImages, markupImages, smoothScroll } from './functions';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formElem = document.querySelector('form');
const galleryElem = document.querySelector('.gallery');
const nextPageButt = document.querySelector('.load-more');
const inputElem = document.querySelector('input');

let inputValue = '';
let page = 1;

const lightbox = new SimpleLightbox('.photo-card a');

inputElem.addEventListener('input', () => {
    inputValue = inputElem.value;
    nextPageButt.style.display = 'none';
});

formElem.addEventListener('submit', (event) => {
    event.preventDefault();
    
    page = 1;
    galleryElem.innerHTML = '';

    generatingImages(inputValue, page);
});

nextPageButt.addEventListener('click', (event) => {
    page++;

    generatingImages(inputValue, page);
});

async function generatingImages(q, page) {
    try {
        const data = await gettingApiImages(q, page);
        if (!data.hits.length) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            galleryElem.innerHTML = '';
            return;
        };
    
        markupImages(data.hits, galleryElem);
        lightbox.refresh();
        nextPageButt.style.display = 'block';

        smoothScroll(page, galleryElem);
    
        if (data.totalHits === galleryElem.childElementCount || galleryElem.childElementCount >= 500) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            nextPageButt.style.display = 'none';
            return;
        };
    } catch (error) {
        Notiflix.Notify.failure('An error occurred. Please try again.');
    };
};