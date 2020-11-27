import axios from 'axios'
import { alert, notice, error } from '@pnotify/core';

const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&'
const API_KEY = '19261458-26a7a8067c525acd82bd2f87d'

export class ImagesQuery {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    return await fetch(`${BASE_URL}q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        this.incrementPage()
        if (data.hits.length === 0) {
        error({
        text: `Вы просмотрели все картинки по запросу  '${this.searchQuery}'`,
        type: 'info',
        delay: 3000
        });
        return;
        }
        return data.hits;
    });
  }

  incrementPage() {
    this.page += 1;
    }
    
  resetPage() {
    this.page = 1;
    }
    
  get query() {
    return this.searchQuery;
    }
    
  set query(newQuery) {
    this.searchQuery = newQuery;
    }
    
}