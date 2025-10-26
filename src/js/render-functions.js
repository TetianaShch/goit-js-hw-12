import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.getElementById('gallery');
const loaderEl = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more');


let lightbox = null;
function ensureLightbox() {
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 200,
      animationSpeed: 180,
      overlayOpacity: 0.9,
    });
  }
  return lightbox;
}

export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(
      ({
        webformatURL = '',
        largeImageURL = '#',
        tags = '',
        likes = 0,
        views = 0,
        comments = 0,
        downloads = 0,
      }) => `
      <li class="card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="meta">
          <span>❤ Likes: <b>${likes}</b></span>
          <span>👁 Views: <b>${views}</b></span>
          <span>💬 Comments: <b>${comments}</b></span>
          <span>⬇ Downloads: <b>${downloads}</b></span>
        </div>
      </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  ensureLightbox().refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderEl.classList.remove('is-hidden');
  loaderEl.setAttribute('aria-hidden', 'false');
}

export function hideLoader() {
  loaderEl.classList.add('is-hidden');
  loaderEl.setAttribute('aria-hidden', 'true');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}
