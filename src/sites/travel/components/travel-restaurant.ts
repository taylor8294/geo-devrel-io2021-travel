import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const restaurantPhotoOptions: google.maps.places.PhotoOptions = {
  maxHeight: 400,
  maxWidth: 700,
};

@customElement('travel-restaurant')
export default class TravelRestaurant extends LitElement {
  @property({ attribute: false })
  place?: google.maps.places.PlaceResult;

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      width: 100%;
    }

    .restaurant-heading {
      font-size: 1.2em;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
      margin: 1em 0 0.5em;
    }

    .restaurant-image {
      border-radius: 6px;
      height: 200px;
      object-fit: cover;
    }

    .restaurant-price-container {
      margin-left: 0.5em;
    }

    .restaurant-vicinity {
      color: #9c9c9c;
      font-size: 0.9em;
      font-style: normal;
      font-weight: 400;
      line-height: 10px;
      margin: 1em 0;
    }

    .additional-info {
      margin: auto 0;
    }

    .additional-info-container {
      align-items: center;
      display: flex;
      margin-top: 1em;
    }

    .additional-info-circle {
      background: #ececec;
      border-radius: 100%;
      height: 40px;
      margin-right: 0.25em;
      width: 44px;
    }

    .additional-info-line {
      background: #ececec;
      border-radius: 10%;
      height: 8px;
      margin-right: 1em;
      width: 20%;
    }

    .attribution-container {
      color: #9c9c9c;
      font-size: 0.7em;
      margin-top: auto;
    }

    .attribution-container a {
      color: inherit;
    }

    @media screen and (max-width: 480px) {
      .restaurant-image,
      travel-placeholder {
        display: none;
      }

      .restaurant-heading {
        margin-top: 0;
      }
    }
  `;

  override render(): TemplateResult {
    // Early return guard clause
    if (!this.place) {
      return html`<div></div>`;
    }

    const {
      rating = 0,
      user_ratings_total = 0,
      name = '',
      vicinity = '',
    } = this.place;

    let imageUrl = '';
    let attribution: TemplateResult | null = null;

    // Safe extraction using optional chaining
    const photo = this.place.photos?.[0];
    if (photo) {
      imageUrl = photo.getUrl(restaurantPhotoOptions);

      const rawAttribution = photo.html_attributions?.[0];
      if (rawAttribution) {
        attribution = html`${unsafeHTML(rawAttribution)}`;
      }
    }

    return html`
      ${imageUrl
        ? html`
            <img
              src="${imageUrl}"
              alt="${name}"
              class="restaurant-image"
            />
          `
        : nothing}

      <div class="restaurant-heading">${name}</div>

      <travel-rating
        .stars=${rating}
        .reviews=${user_ratings_total}
      ></travel-rating>

      <span class="restaurant-vicinity">${vicinity}</span>

      <div class="additional-info-container">
        <div class="additional-info-circle"></div>
        <div class="additional-info-line"></div>
        <div class="additional-info-circle"></div>
        <div class="additional-info-line"></div>
        <div class="additional-info-circle"></div>
        <div class="additional-info-line"></div>
      </div>

      ${attribution
        ? html`
            <div class="attribution-container">
              <div>Image by ${attribution}</div>
            </div>
          `
        : nothing}
    `;
  }
}

// Enable global JSX / HTML custom element type recognition
declare global {
  interface HTMLElementTagNameMap {
    'travel-restaurant': TravelRestaurant;
  }
}

if(customElements) customElements.define("travel-restaurant", TravelRestaurant);