'use strict';

import Notiflix from 'notiflix';
import axios from "axios";

const apiKey = '19760378-d2f1c7488e9d6752a9d7092b3';
const axiosOptions = {
    key: apiKey,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
}

const formElem = document.querySelector('form');
const galleryElem = document.querySelector('.gallery');
const nextPageButt = document.querySelector('.load-more');
const inputElem = document.querySelector('input');

let inputValue = '';
let page = 1;

inputElem.addEventListener('input', () => {
    inputValue = inputElem.value;
    nextPageButt.style.display = 'none';
})

formElem.addEventListener('submit', (event) => {
    event.preventDefault();

    page = 1;
    galleryElem.innerHTML = '';

    console.log(inputValue);

    generatingImages(inputValue, page);

});

nextPageButt.addEventListener('click', (event) => {
    page++;
    console.log(inputValue);
    generatingImages(inputValue, page);
})

async function gettingApiImages(q, pg) {
    try {
        const response = await axios.get('https://pixabay.com/api/', { params: { ...axiosOptions, q: q, page: page }});
        const data = await response.data.hits;
        console.log(response)
        return data;
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are problems with API.');
    }
}

function markupImages(images) {
    images.forEach((img) => {
        const imgMarkup = `
            <div class="photo-card">
                <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${img.likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${img.views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${img.views}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${img.downloads}
                    </p>
                </div>
            </div>
        `
        galleryElem.insertAdjacentHTML('beforeend', imgMarkup);
    });
};

function generatingImages(q, page) {
    const data = gettingApiImages(q, page);
    data
    .then(data => {
        if (!data.length) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            galleryElem.innerHTML = '';
            return;
        }
        if (data.length !== 40) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            markupImages(data);
            nextPageButt.style.display = 'none';
            return;
        };
        markupImages(data);
        nextPageButt.style.display = 'block';
    });
}