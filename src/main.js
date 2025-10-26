import './css/styles.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');
const submitBtn = form.querySelector('button[type="submit"]');

let currentQuery = '';
let currentPage = 1;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function setLoading(isLoading, { duringLoadMore = false } = {}) {
  submitBtn.disabled = isLoading;
  loadMoreBtn.disabled = isLoading;

  if (isLoading) showLoader();
  else hideLoader();

  if (!duringLoadMore && isLoading) hideLoadMoreButton();
}

function shouldShowMore(totalHits, page) {
  return page * PER_PAGE < totalHits;
}

function handleEndOfCollection() {
  hideLoadMoreButton();
  iziToast.info({
    title: 'Кінець колекції',
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
  });
}

async function onSearch(evt) {
  evt.preventDefault();

  const query = form.elements['search-text'].value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Упс',
      message: 'Введи ключове слово перед пошуком.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  hideLoadMoreButton();
  clearGallery();

  setLoading(true);
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const hits = data?.hits ?? [];

    if (hits.length === 0) {
      iziToast.info({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    if (shouldShowMore(data.totalHits, currentPage)) {
      showLoadMoreButton();
    } else {
      handleEndOfCollection();
    }
  } catch {
    iziToast.error({
      title: 'Помилка',
      message: 'Проблема з мережею або API. Спробуй пізніше.',
      position: 'topRight',
    });
  } finally {
    setLoading(false);
  }
}

async function onLoadMore() {
  currentPage += 1;
  setLoading(true, { duringLoadMore: true });

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const hits = data?.hits ?? [];
    if (hits.length === 0) {
      handleEndOfCollection();
      return;
    }

    createGallery(hits);

    if (!shouldShowMore(data.totalHits, currentPage)) {
      handleEndOfCollection();
    }

 
    const firstCard = document.querySelector('.gallery .card');
    if (firstCard) {
      const h = firstCard.getBoundingClientRect().height;
      window.scrollBy({ top: h * 2, behavior: 'smooth' });
    }
  } catch {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити наступні зображення.',
      position: 'topRight',
    });
  } finally {
    setLoading(false);
  }
}


