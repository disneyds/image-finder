import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles.css';
import './styles/main.scss';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import 'material-design-icons';
import * as basicLightbox from 'basiclightbox';

import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import { alert, notice, error } from '@pnotify/core';
import cardMarkup from './templates/img-card.hbs';
import getRefs from './JS/refs';
import { ImagesQuery } from './JS/apiService';
import LoadMoreBtn from './JS/load-more-btn'

const refs = getRefs();
const imagesQuery = new ImagesQuery();


refs.btn.addEventListener('click', onSearch)


// const btnLoadMore = new LoadMoreBtn({selector: '.btn-sub'});


refs.btnLoadMore.addEventListener('click', onLoadMore)




function onSearch(e) {
    e.preventDefault();
    imagesQuery.searchQuery = refs.searchForm.elements.query.value;
    imagesQuery.resetPage();
    // btnLoadMore.disable();
    if (imagesQuery.searchQuery === '') {
        alert({
        text: "Введите запрос поиска",
        type: 'info',
        delay: 3000
        });
        return;
    }
    clearGallery();
    fetchAndRender();
    
}
 
function onLoadMore() {
    fetchAndRender();
};
 


 

function fetchAndRender() {
    
    imagesQuery.fetchImages().then(data => {
            if (data.length === 0) {
            error({
            text: "По такому критерию картинок не найдено! Введите заново! ",
            type: 'info',
            delay: 3000
            });
            return;
            }
        // btnLoadMore.enable();
        renderCards(data)
    });
}
 
function renderCards(img) {
    refs.container.insertAdjacentHTML('beforeend', cardMarkup(img));
    document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', onGalleryItemClick));
}
   
function clearGallery() {
  refs.container.innerHTML = '';
}


function onGalleryItemClick(e) {
  const imageInstance = basicLightbox.create(`
 	<img class="large-image" src="${e.currentTarget.dataset.largeImage}" alt=""/>
 `);
  imageInstance.show();
}
