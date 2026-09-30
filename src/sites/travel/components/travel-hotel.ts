import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const hotelMarkerUrl =
  "static/travel/images/hotels-ui-green-marker.svg";

const hotelPhotoOptions: google.maps.places.PhotoOptions = {
  maxWidth: 240,
};

export default class TravelHotel extends LitElement {
  checkIn: string;
  checkOut: string;
  accomodationType: string;

  place?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    formatted_address?: string;
    photos?: Array<{
      getUrl: (options: google.maps.places.PhotoOptions) => string;
      html_attributions: string[];
    }>;
  };

  constructor() {
    super();

    this.checkIn = "";
    this.checkOut = "";
    this.accomodationType = "";
  }

  static properties = {
    place: {
      attribute: false,
    },

    checkIn: {
      attribute: "checkin",
    },

    checkOut: {
      attribute: "checkout",
    },

    accomodationType: {
      attribute: "accomodation-type",
    },
  };

  render() {
    if (!this.place) {
      return;
    }

    const {
      name,
      rating,
      user_ratings_total,
      formatted_address,
      photos,
    } = this.place;

    let attribution;
    let imageUrl = "";

    if (photos && photos.length > 0) {
      const photo = photos[0];

      imageUrl = photo.getUrl(hotelPhotoOptions);

      attribution = unsafeHTML(
        `Image by ${photo.html_attributions[0]}`
      );
    }

    return html`
      <div class="travel-details">
        <div class="hotels-header">
          <img
            class="hotels-image"
            src="${imageUrl}"
          />

          <div class="hotels-header-content">
            <div class="hotels-header-content-title">
              ${name}
            </div>

            <div class="hotels-header-content-description">
              <travel-rating
                stars=${rating}
                reviews=${user_ratings_total}
              ></travel-rating>
            </div>

            <div class="hotels-header-subcontent">
              <img
                class="hotels-address-marker"
                src="${hotelMarkerUrl}"
              />

              <span class="hotels-address-element">
                ${formatted_address}
              </span>
            </div>
          </div>
        </div>

        <div class="hotels-travel">
          <div class="hotels-travel-check">
            <div class="hotels-key">
              Check in:
            </div>

            <div class="hotels-value">
              ${this.checkIn}
            </div>
          </div>

          <div class="hotels">
            <div class="hotels-key">
              Check out:
            </div>

            <div class="hotels-value">
              ${this.checkOut}
            </div>
          </div>
        </div>

        <div class="hotels-accomodation">
          <div class="hotels-key">
            Type of accomodation:
          </div>

          <div class="hotels-value">
            ${this.accomodationType}
          </div>
        </div>
      </div>

      <travel-placeholder></travel-placeholder>

      ${
        attribution
          ? html`
              <travel-attribution>
                ${attribution}
              </travel-attribution>
            `
          : null
      }
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      justify-content: space-between;
    }

    .travel-details {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
    }

    .hotels-header {
      align-items: center;
      display: flex;
    }

    .hotels-image {
      border-radius: 6px;
      width: 120px;
    }

    .hotels-header-content {
      margin: 0.5em;
      overflow: hidden;
    }

    .hotels-header-content-title {
      font-size: 1em;
      font-weight: 500;
      margin-bottom: 0.5em;
    }

    .hotels-header-content-description {
      align-items: center;
      display: flex;
      font-size: 0.9em;
    }

    .hotels-reviews {
      color: #4285f4;
      margin: 0 0 0 0.2em;
    }

    .hotels-type {
      margin-left: 0.2em;
    }

    .hotels-header-subcontent {
      align-items: center;
      color: #757575;
      display: flex;
      font-size: 1em;
      font-style: normal;
      font-weight: 400;
      margin-top: 0.4em;
    }

    .hotels-address-marker {
      width: 25px;
    }

    .hotels-address-element {
      font-size: 0.9em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hotels-travel {
      display: flex;
      margin-top: 0.8em;
    }

    .hotels-travel-check {
      display: flex;
      flex-direction: column;
      margin-right: 2.5em;
    }

    .hotels-key,
    .hotels-travel-check {
      font-style: normal;
      font-weight: 400;
    }

    .hotels-key {
      color: #9a9a9a;
      font-size: 0.9em;
    }

    .hotels-value {
      font-size: 1em;
      line-height: 1.7em;
    }

    .hotels-accomodation {
      display: flex;
      flex-direction: column;
      margin-top: 1em;
    }

    @media screen and (max-width: 480px) {
      .hotels-accomodation,
      travel-placeholder {
        display: none;
      }
    }
  `;
}

// Enable global JSX / HTML custom element type recognition
declare global {
  interface HTMLElementTagNameMap {
    'travel-hotel': TravelHotel;
  }
}

if(customElements) customElements.define("travel-hotel", TravelHotel);