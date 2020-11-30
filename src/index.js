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
const observer = new IntersectionObserver(onEntry, {
    rootMargin: '200px',
})

function onEntry(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && imagesQuery.searchQuery !== '') {
            fetchAndRender();
        }
     })
}
 
observer.observe(refs.helper)





const btnLoad = new LoadMoreBtn({selector: '.btn-sub'});
btnLoad.refs.button.addEventListener('click', onSearch)






function onSearch(e) {
    e.preventDefault();
    imagesQuery.searchQuery = refs.searchForm.elements.query.value;
    imagesQuery.resetPage();
    
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
 
async function fetchAndRender() {
    btnLoad.disable();
    await imagesQuery.fetchImages()
    .then(data => {
        if (data.length === 0) {
                notice({
                text: "По такому критерию картинок не найдено! Введите заново! ",
                type: 'info',
                delay: 3000
                });
            btnLoad.enable();
            return;
        }
        renderCards(data);
        btnLoad.enable();
    })
    .catch(e => {
        if (e) {
            error({
                text: `Вы просмотрели все картинки по запросу ${imagesQuery.searchQuery}`,
                type: 'info',
                delay: 3000
            });
            btnLoad.enable();
            return;
        }
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
