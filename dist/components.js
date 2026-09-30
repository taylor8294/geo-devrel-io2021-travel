import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@3/+esm";
import { unsafeHTML } from "https://cdn.jsdelivr.net/npm/lit@3/directives/unsafe-html.js/+esm";
import "https://cdn.jsdelivr.net/npm/@material/mwc-button/+esm";
import "https://cdn.jsdelivr.net/npm/@material/mwc-drawer/+esm";
import "https://cdn.jsdelivr.net/npm/@material/mwc-icon-button/+esm";
//import "https://cdn.jsdelivr.net/npm/@material/mwc-icon/+esm";
import "https://cdn.jsdelivr.net/npm/@material/mwc-linear-progress/+esm";
import "https://cdn.jsdelivr.net/npm/@material/mwc-fab/+esm";

// ---------------------------------------------------------------------------
// <gmp-logo>
// ---------------------------------------------------------------------------

class GmpLogo extends LitElement {
  render() {
    return html`
      <svg height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1193.98 156.13">
          <path fill="#5f6368" d="M558.11,116.73V43.08h9.46l25.61,44.85h0.41l25.61-44.85h9.46v73.65h-9.46V73l0.41-12.34h-0.41l-23,40.42h-5.55   l-23-40.42h-0.41L567.57,73v43.72L558.11,116.73z M656.23,118.38c-4.89,0.16-9.67-1.49-13.42-4.63c-3.58-3.04-5.57-7.55-5.4-12.24   c-0.19-5.1,2.21-9.96,6.38-12.91c4.25-3.12,9.5-4.68,15.74-4.68c5.55,0,10.11,1.03,13.68,3.09v-1.45c0.14-3.39-1.26-6.66-3.8-8.9   c-2.6-2.26-5.96-3.45-9.41-3.34c-2.62-0.02-5.2,0.67-7.46,2c-2.1,1.17-3.71,3.06-4.54,5.31l-8.64-3.7c1.46-3.39,3.85-6.29,6.89-8.38   c3.43-2.57,7.95-3.86,13.58-3.86c6.45,0,11.78,1.89,16,5.66c4.22,3.77,6.35,9.09,6.38,15.94v30.45h-9.05v-7h-0.41   C669.01,115.5,663.5,118.38,656.23,118.38z M657.77,109.74c3.98-0.03,7.8-1.59,10.65-4.37c3.05-2.58,4.8-6.38,4.79-10.37   c-2.67-2.19-6.67-3.29-12-3.29c-4.59,0-8.06,1-10.39,3c-2.17,1.68-3.46,4.25-3.5,7c-0.05,2.38,1.17,4.61,3.19,5.86   c2.15,1.45,4.68,2.2,7.27,2.17H657.77z M719.18,118.38c-3.6,0.06-7.16-0.79-10.34-2.47c-2.79-1.41-5.15-3.54-6.84-6.17h-0.41l0.41,7   v22.22h-9.46V66.33h9.05v7H702c1.69-2.63,4.05-4.76,6.84-6.17c3.18-1.68,6.74-2.53,10.34-2.47c6.51,0,12.14,2.57,16.87,7.71   s7.1,11.52,7.1,19.13c0,7.61-2.37,13.99-7.1,19.13S725.69,118.37,719.18,118.38z M717.64,109.74c4.31,0.03,8.43-1.79,11.31-5   c3.15-3.33,4.73-7.74,4.73-13.22c0-5.48-1.56-9.88-4.68-13.21c-5.77-6.28-15.54-6.68-21.82-0.91c-0.3,0.28-0.59,0.56-0.86,0.86   c-3.12,3.29-4.68,7.72-4.68,13.27c0,5.55,1.56,9.98,4.68,13.27C709.22,107.99,713.33,109.78,717.64,109.74z M770,118.38   c-5.62,0-10.27-1.37-13.94-4.11c-3.57-2.63-6.36-6.18-8.06-10.27l8.43-3.5c2.67,6.31,7.23,9.46,13.68,9.46c2.56,0.09,5.1-0.6,7.25-2   c1.77-1.1,2.85-3.05,2.83-5.14c0-3.29-2.3-5.52-6.89-6.69l-10.2-2.44c-3.33-0.9-6.44-2.5-9.1-4.69c-2.85-2.23-4.46-5.69-4.32-9.31   c0-4.46,1.97-8.08,5.92-10.85c4.11-2.83,9.01-4.29,14-4.17c4.17-0.08,8.29,0.95,11.93,3c3.42,1.96,6.06,5.05,7.47,8.74l-8.2,3.39   c-1.85-4.45-5.69-6.68-11.52-6.69c-2.48-0.08-4.94,0.52-7.1,1.75c-1.77,0.92-2.88,2.74-2.88,4.73c0,2.88,2.23,4.83,6.69,5.86   l10,2.37c4.73,1.1,8.23,2.99,10.49,5.66c2.2,2.5,3.4,5.72,3.39,9.05c0.05,4.44-2.01,8.63-5.55,11.31   C780.6,116.87,775.83,118.38,770,118.38z M831.81,116.73h-9.46V43.08h25.1c6-0.09,11.8,2.14,16.2,6.22   c4.48,3.97,6.99,9.71,6.84,15.7c0.14,5.98-2.36,11.72-6.84,15.69c-4.4,4.08-10.2,6.31-16.2,6.22h-15.64V116.73z M831.81,77.85h15.84   c3.63,0.15,7.13-1.31,9.57-4c4.8-4.92,4.8-12.77,0-17.69c-2.44-2.69-5.94-4.15-9.57-4h-15.84V77.85z M888.69,116.73h-9.46V43.08   h9.46V116.73z M915.64,118.38c-4.89,0.16-9.67-1.49-13.42-4.63c-3.58-3.04-5.57-7.55-5.4-12.24c-0.19-5.1,2.21-9.96,6.38-12.91   c4.25-3.12,9.5-4.68,15.74-4.68c5.55,0,10.11,1.03,13.68,3.09v-1.45c0.14-3.39-1.26-6.66-3.81-8.9c-2.59-2.25-5.93-3.44-9.36-3.34   c-2.62-0.02-5.2,0.67-7.46,2c-2.12,1.17-3.75,3.07-4.58,5.35l-8.64-3.7c1.46-3.39,3.85-6.29,6.89-8.38   c3.43-2.57,7.95-3.86,13.58-3.86c6.45,0,11.78,1.89,16,5.66s6.35,9.09,6.38,15.94v30.45h-9.05v-7h-0.41   C928.42,115.51,922.91,118.38,915.64,118.38z M917.18,109.74c3.98-0.03,7.8-1.59,10.65-4.37c3.04-2.58,4.79-6.38,4.78-10.37   c-2.67-2.19-6.67-3.29-12-3.29c-4.59,0-8.06,1-10.39,3c-2.17,1.68-3.46,4.25-3.5,7c-0.05,2.38,1.17,4.61,3.19,5.86   C912.06,109.02,914.59,109.77,917.18,109.74z M973.14,117.55c-5.28,0-9.31-1.41-12.09-4.22c-2.78-2.81-4.17-6.79-4.17-11.93V75H948   v-8.67h8.85V50.9h9.46v15.43h12.34V75h-12.3v25.71c0,5.49,2.26,8.23,6.79,8.23c1.48,0.05,2.96-0.23,4.32-0.82l3.29,8.13   C978.33,117.19,975.74,117.64,973.14,117.55z M1012.84,42.67c2.6-0.07,5.19,0.38,7.61,1.34l-3.29,8.13   c-1.36-0.6-2.84-0.88-4.32-0.82c-2.23-0.09-4.41,0.71-6.07,2.21c-1.58,1.47-2.37,3.62-2.37,6.43v6.38h13.17V75h-13.17v41.76h-9.46   V75h-9.46v-8.67h9.46v-6.69c0-5.14,1.65-9.25,4.94-12.34C1003.17,44.21,1007.49,42.67,1012.84,42.67z M1028,72.35   c4.87-5.11,11.07-7.66,18.62-7.66s13.75,2.55,18.62,7.66s7.3,11.5,7.3,19.18s-2.43,14.07-7.3,19.18   c-4.87,5.11-11.07,7.66-18.62,7.66c-7.55,0-13.75-2.55-18.62-7.66c-4.87-5.11-7.31-11.5-7.3-19.18   C1020.71,83.85,1023.14,77.46,1028,72.35z M1035,104.75c6.04,6.39,16.12,6.67,22.51,0.63c0.22-0.21,0.43-0.42,0.63-0.63   c3.26-3.33,4.89-7.74,4.89-13.22s-1.63-9.89-4.89-13.22c-6.04-6.39-16.12-6.67-22.51-0.63c-0.22,0.21-0.43,0.42-0.63,0.63   c-3.26,3.33-4.89,7.74-4.89,13.22S1031.74,101.42,1035,104.75z M1089.58,116.73h-9.46v-50.4h9.05v8.23h0.41   c1.09-2.9,3.19-5.31,5.91-6.79c2.6-1.67,5.6-2.59,8.69-2.67c2.43-0.07,4.84,0.35,7.1,1.23l-3.6,8.85c-1.61-0.53-3.3-0.78-5-0.72   c-3.47,0.02-6.77,1.49-9.1,4.06c-2.72,2.86-4.16,6.71-4,10.65L1089.58,116.73z M1117.45,116.73v-50.4h9.05v7h0.41   c1.64-2.58,3.92-4.69,6.63-6.12c2.7-1.6,5.76-2.47,8.9-2.52c7.82,0,13.13,3.22,15.94,9.67c3.66-6.21,10.42-9.92,17.62-9.68   c5.97,0,10.46,1.9,13.47,5.71s4.52,8.97,4.53,15.48v30.86h-9.46V87.31c0-5.07-0.93-8.67-2.78-10.8s-4.66-3.19-8.43-3.19   c-3.66-0.03-7.1,1.74-9.21,4.73c-2.41,3.08-3.7,6.89-3.65,10.8v27.88H1151V87.31c0-5.07-0.93-8.67-2.78-10.8s-4.66-3.19-8.43-3.19   c-3.66-0.03-7.1,1.74-9.21,4.73c-2.41,3.08-3.7,6.89-3.65,10.8v27.88L1117.45,116.73z"></path>
          <path fill="#5f6368" d="M239.71,118.44c-11.32,0.13-22.21-4.36-30.14-12.44c-8.2-7.72-12.79-18.52-12.65-29.78   c-0.14-11.26,4.45-22.06,12.65-29.78c7.94-8.06,18.83-12.53,30.14-12.39c10.8-0.15,21.21,4.03,28.9,11.62l-8.13,8.13   c-5.57-5.38-13.04-8.34-20.78-8.23c-8.09-0.15-15.87,3.1-21.45,8.95c-5.77,5.73-8.94,13.57-8.79,21.7   c-0.17,8.16,3.01,16.03,8.8,21.78c5.58,5.85,13.36,9.1,21.45,8.95c8.57,0,15.67-2.81,21.29-8.43c3.33-3.33,5.42-8.17,6.27-14.5   h-27.56V72.46h38.78c0.44,2.37,0.65,4.79,0.62,7.2c0,11.33-3.33,20.32-10,26.95C261.58,114.5,251.78,118.44,239.71,118.44z    M329.82,110.67c-10.82,10.34-27.86,10.34-38.68,0c-5.24-5.07-8.12-12.1-7.92-19.39c-0.2-7.29,2.68-14.32,7.92-19.39   c10.82-10.34,27.86-10.34,38.68,0c5.24,5.07,8.11,12.1,7.92,19.39c0.19,7.29-2.68,14.32-7.93,19.39L329.82,110.67z M299.68,103.06   c5.59,5.96,14.95,6.27,20.92,0.68c0.23-0.22,0.46-0.45,0.68-0.68c3.03-3.16,4.67-7.4,4.53-11.78c0.16-4.38-1.45-8.65-4.47-11.83   c-5.72-5.99-15.22-6.21-21.21-0.49c-0.17,0.16-0.33,0.32-0.49,0.49c-3.02,3.18-4.63,7.45-4.47,11.83   C295.03,95.65,296.65,99.9,299.68,103.06z M389.27,110.67c-10.82,10.33-27.85,10.33-38.67,0c-5.24-5.07-8.12-12.1-7.92-19.39   c-0.2-7.29,2.68-14.32,7.92-19.39c10.82-10.33,27.85-10.33,38.67,0c5.24,5.07,8.11,12.1,7.92,19.39   C397.39,98.57,394.51,105.6,389.27,110.67z M359.13,103.06c5.59,5.96,14.95,6.27,20.92,0.68c0.23-0.22,0.46-0.45,0.68-0.68   c3.03-3.16,4.67-7.4,4.53-11.78c0.16-4.38-1.45-8.65-4.47-11.83c-5.72-5.99-15.22-6.21-21.21-0.49c-0.17,0.16-0.33,0.32-0.49,0.49   c-3.02,3.18-4.63,7.45-4.47,11.83C354.48,95.65,356.1,99.9,359.13,103.06z M428.35,142.82c-6.03,0-11.11-1.61-15.22-4.83   c-3.87-2.91-6.92-6.77-8.85-11.21l10.39-4.32c1.13,2.65,2.89,4.98,5.14,6.79c2.41,1.95,5.44,2.97,8.54,2.88   c4.53,0,8.08-1.37,10.65-4.11c2.57-2.74,3.86-6.68,3.86-11.83v-3.91h-0.41c-3.33,4.11-8.1,6.17-14.3,6.17   c-6.93,0-13-2.64-18.21-7.92c-5.11-5.04-7.94-11.95-7.82-19.13c-0.13-7.23,2.7-14.19,7.82-19.29c5.21-5.33,11.28-8,18.21-8   c2.89-0.04,5.75,0.56,8.38,1.75c2.26,0.99,4.28,2.47,5.91,4.32h0.41v-4.41h11.31v48.76c0,9.46-2.42,16.54-7.25,21.24   C442.08,140.47,435.89,142.82,428.35,142.82z M429.17,107.75c3.97,0.07,7.77-1.65,10.34-4.68c2.82-3.22,4.31-7.39,4.17-11.67   c0.14-4.33-1.34-8.55-4.17-11.83c-2.56-3.05-6.36-4.79-10.34-4.73c-4.08-0.05-7.99,1.68-10.7,4.73c-2.97,3.21-4.56,7.46-4.42,11.83   c-0.13,4.32,1.46,8.52,4.42,11.67c2.73,3.02,6.63,4.73,10.71,4.67L429.17,107.75z M474.33,37v79.82H462.4V37H474.33z M507,118.44   c-7.22,0.19-14.19-2.65-19.23-7.82c-5.11-5.12-7.89-12.11-7.71-19.34c0-7.95,2.49-14.47,7.46-19.54c4.72-4.97,11.3-7.73,18.15-7.61   c3.14-0.03,6.25,0.58,9.15,1.8c2.61,1.07,4.99,2.64,7,4.63c1.67,1.66,3.16,3.51,4.42,5.5c1.05,1.7,1.95,3.49,2.67,5.35l1.23,3.09   l-36.31,15c2.81,5.49,7.2,8.23,13.17,8.23c5.49,0,9.94-2.5,13.37-7.51l9.26,6.17c-2.32,3.34-5.29,6.17-8.74,8.33   C516.73,117.3,511.9,118.6,507,118.44z M491.88,90.44l24.27-10.08c-0.75-1.79-2.1-3.26-3.81-4.17c-1.91-1.08-4.08-1.63-6.27-1.59  c-3.5,0-6.77,1.44-9.82,4.32c-3.05,2.88-4.49,6.73-4.33,11.54L491.88,90.44z"></path>
          <path fill="#1a73e8" d="M95.18,10.45C90.59,9,85.7,8.21,80.63,8.21c-14.8,0-28.04,6.68-36.87,17.19l22.75,19.13L95.18,10.45z"></path>
          <path fill="#ea4335" d="M43.76,25.41c-7.03,8.37-11.28,19.16-11.28,30.95c0,9.05,1.8,16.39,4.77,22.97l29.26-34.79L43.76,25.41z"></path>
          <path fill="#4285f4" d="M80.63,37.94c10.17,0,18.42,8.25,18.42,18.42c0,4.53-1.64,8.68-4.35,11.89c0,0,14.55-17.3,28.66-34.08   c-5.83-11.21-15.95-19.84-28.18-23.72L66.51,44.54C69.88,40.51,74.96,37.94,80.63,37.94"></path>
          <path fill="#fbbc04" d="M80.63,74.78c-10.17,0-18.42-8.25-18.42-18.42c0-4.5,1.61-8.62,4.29-11.82L37.24,79.33   c5,11.09,13.32,20,21.88,31.21l35.57-42.29C91.31,72.24,86.27,74.78,80.63,74.78"></path>
          <path fill="#34a853" d="M93.99,122.08c16.07-25.12,34.79-36.52,34.79-65.72c0-8.01-1.96-15.55-5.42-22.19l-64.23,76.36   c2.72,3.57,5.47,7.36,8.15,11.55c9.76,15.09,7.06,24.14,13.36,24.14C86.93,146.22,84.22,137.17,93.99,122.08"></path>
      </svg>
    `;
  }
}

customElements.define("gmp-logo", GmpLogo);

// ---------------------------------------------------------------------------
// Shared Google/Places asset configuration
// ---------------------------------------------------------------------------

const hotelMarkerUrl =
  "static/travel/images/hotels-ui-green-marker.svg";

const hotelPhotoOptions = {
  maxWidth: 240,
};

const restaurantPhotoOptions = {
  maxHeight: 400,
  maxWidth: 700,
};

const sightPhotoOptions = {
  maxHeight: 150,
  maxWidth: 200,
};

// ---------------------------------------------------------------------------
// <travel-hotel>
// ---------------------------------------------------------------------------

class TravelHotel extends LitElement {
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

customElements.define(
  "travel-hotel",
  TravelHotel
);

// ---------------------------------------------------------------------------
// <travel-rating>
// ---------------------------------------------------------------------------

const numberFormatter = new Intl.NumberFormat();

class TravelRating extends LitElement {
  constructor() {
    super();

    this.stars = 0;
    this.reviews = 0;
  }

  static properties = {
    stars: {
      type: Number,
      attribute: "stars",
    },

    reviews: {
      type: Number,
      attribute: "reviews",
    },
  };

  render() {
    return html`
      <div class="infobox-rating">
        <div class="stars-container">
          <span class="stars-text">
            ${this.stars.toFixed(1)}
          </span>

          ${this.renderStars(this.stars)}
        </div>

        ${this.renderReviews(this.reviews)}
      </div>
    `;
  }

  renderStars(stars) {
    const result = [];

    const rounded =
      Math.round(2 * stars) / 2;

    const fullStars =
      Math.floor(rounded);

    const hasHalfStar =
      rounded % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      let icon;

      if (i < fullStars) {
        icon = "star";
      } else if (
        i === fullStars &&
        hasHalfStar
      ) {
        icon = "star_half";
      } else {
        icon = "star_border";
      }

      result.push(
        html`
          <mwc-icon class="star-icon">
            ${icon}
          </mwc-icon>
        `
      );
    }

    return result;
  }

  renderReviews(reviews) {
    return reviews > 0
      ? html`
          <p class="infobox-reviews">
            ${numberFormatter.format(
              this.reviews
            )}
            reviews
          </p>
        `
      : "";
  }

  static styles = css`
    .infobox-rating {
      color: #757575;
      font-size: 0.8em;
      font-style: normal;
      font-weight: 400;
      line-height: 10px;
      text-align: center;
    }

    .infobox-rating,
    .stars-container {
      align-items: center;
      display: flex;
    }

    .star-icon {
      --mdc-icon-size: 14px;
      color: #f4b400;
    }

    .stars-text {
      margin-right: 0.2em;
    }

    .infobox-reviews {
      color: #4285f4;
      margin: 0;
      padding-left: 0.7em;
    }
  `;
}

customElements.define(
  "travel-rating",
  TravelRating
);

// ---------------------------------------------------------------------------
// <travel-placeholder>
// ---------------------------------------------------------------------------

class TravelPlaceholder extends LitElement {
  render() {
    return Array.from(
      Array(4),
      () =>
        Math.floor(
          50 * Math.random() + 120
        )
    ).map(
      width => html`
        <div class="placeholder-container">
          <div class="placeholder-circle"></div>

          <div
            class="placeholder-box"
            style="width: ${width}px;"
          ></div>
        </div>
      `
    );
  }

  static styles = css`
    .placeholder-container {
      align-items: center;
      display: flex;
      margin: 1em 0;
    }

    .placeholder-circle {
      background: #ececec;
      border-radius: 50%;
      height: 1em;
      margin-right: 0.5em;
      width: 1em;
    }

    .placeholder-box {
      background: #ececec;
      border-radius: 2px;
      height: 0.6em;
    }
  `;
}

customElements.define(
  "travel-placeholder",
  TravelPlaceholder
);

// ---------------------------------------------------------------------------
// <travel-flight-route>
// ---------------------------------------------------------------------------

class TravelFlightRoute extends LitElement {
  render() {
    return html`
      <div class="travel-details">
        <div class="flight-data">
          <span class="city">
            Paris
          </span>

          <span class="airport">
            CDG
          </span>

          <span class="time">
            5:35 PM
          </span>
        </div>

        <div class="travel-time">
          <mwc-icon>
            horizontal_rule
          </mwc-icon>

          <mwc-icon class="plane-icon">
            flight
          </mwc-icon>

          <mwc-icon>
            horizontal_rule
          </mwc-icon>

          <p>
            1 hr 20 min
          </p>
        </div>

        <div class="flight-data">
          <span class="city">
            London
          </span>

          <span class="airport">
            LHR
          </span>

          <span class="time">
            7:55 PM
          </span>
        </div>
      </div>

      <div class="info">
        <span>
          Air France
        </span>

        <span>
          Economy
        </span>

        <span>
          Airbus A319
        </span>

        <span>
          AF 1281
        </span>
      </div>

      <travel-placeholder></travel-placeholder>

      <div class="attribution-container">
        <travel-attribution
          name="plane-test"
          href="https://poly.google.com/view/chTRxzzMesi"
          author="Wellpleased Events"
          license="CC-BY 3.0"
        ></travel-attribution>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .travel-details {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.8em;
      width: 100%;
    }

    .flight-data {
      color: #4285f4;
      display: flex;
      flex-direction: column;
    }

    .city {
      font-size: 1em;
    }

    .airport,
    .city {
      font-family:
        Google Sans,
        Roboto,
        sans-serif;
    }

    .airport {
      font-size: 1.8em;
      padding: 0.2em 0;
    }

    .time,
    .travel-time {
      color: #858585;
      font-size: 1em;
    }

    .travel-time {
      --mdc-icon-size: 40px;
      letter-spacing: 0.25px;
      text-align: center;
    }

    .plane-icon {
      padding: 0.2em;
      transform: rotate(90deg);
    }

    .info {
      color: #b9b9b9;
      font-size: 0.9em;
      letter-spacing: 0.25px;
      line-height: 20px;
      width: 100%;
    }

    .info span:not(:last-child)::after {
      content: " \\B7 ";
      margin: 0 0.4em;
    }

    travel-placeholder {
      margin: auto 0;
    }

    .attribution-container {
      margin-top: auto;
    }

    @media screen and (max-width: 480px) {
      .info,
      travel-placeholder {
        display: none;
      }
    }
  `;
}

customElements.define(
  "travel-flight-route",
  TravelFlightRoute
);

// ---------------------------------------------------------------------------
// <travel-taxi-route>
// ---------------------------------------------------------------------------

class TravelTaxiRoute extends LitElement {
  render() {
    return html`
      <div class="travel-details">
        <div class="address-container">
          <mwc-icon class="place-icon">
            place
          </mwc-icon>

          <div class="address">
            <span>
              Heathrow Airport
            </span>

            <span>
              Terminal 2, Inner Ring E,
              Hounslow TW6 1RR, UK
            </span>
          </div>
        </div>

        <div class="address-container">
          <mwc-icon class="place-icon">
            place
          </mwc-icon>

          <div class="address">
            <span>
              The Ritz Hotel
            </span>

            <span>
              150 Piccadilly, St. James's,
              London W1J 9BR, UK
            </span>
          </div>
        </div>
      </div>

      <div class="info">
        <span>
          38min
        </span>

        <span>
          51£
        </span>

        <span>
          Estate car
        </span>

        <span>
          Up to 4 persons
        </span>
      </div>

      <travel-placeholder></travel-placeholder>

      <div class="attribution-container">
        <travel-attribution
          name="Taxi Low Poly"
          href="https://skfb.ly/6UZsJ"
          author="TheJester"
          license="CC-BY 4.0"
        ></travel-attribution>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .travel-details {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 1em;
      width: 100%;
    }

    .place-icon {
      --mdc-icon-size: 30px;
      color: #f4b400;
      position: relative;
    }

    .address-container {
      display: flex;
      padding-bottom: 1.2em;
    }

    .address-container:first-child
      > .place-icon:first-child::after {
      border-left: 4px solid #f4b400;
      border-radius: 20%;
      content: "";
      height: 30px;
      left: 42%;
      position: absolute;
      top: calc(50% + 10px);
    }

    .address {
      color: #000;
      display: flex;
      flex-direction: column;
      font-size: 1em;
    }

    .address span:nth-child(2) {
      color: #9c9c9c;
      font-size: 0.9em;
      line-height: 2em;
    }

    .info {
      color: #b9b9b9;
      font-size: 0.9em;
      letter-spacing: 0.25px;
      line-height: 20px;
      width: 100%;
    }

    .info span:not(:last-child)::after {
      content: " \\B7 ";
      margin: 0 0.4em;
    }

    travel-placeholder {
      margin: auto 0;
    }

    .attribution-container {
      margin-top: auto;
    }

    @media screen and (max-width: 480px) {
      .taxi-route {
        margin-top: 0;
        padding: 0 0 0.5em;
      }

      .address {
        overflow: hidden;
        white-space: nowrap;
      }

      .address span:nth-child(2) {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info,
      travel-placeholder {
        display: none;
      }
    }
  `;
}

customElements.define(
  "travel-taxi-route",
  TravelTaxiRoute
);

// ---------------------------------------------------------------------------
// <travel-attribution>
// ---------------------------------------------------------------------------

const licenseUrls = {
  "CC-BY 3.0":
    "https://creativecommons.org/licenses/by/3.0/legalcode",

  "CC-BY 4.0":
    "https://creativecommons.org/licenses/by/4.0/legalcode",
};

class TravelAttribution extends LitElement {
  constructor() {
    super();

    this.name = "";
    this.href = "";
    this.author = "";
    this.license = "CC-BY 3.0";
    this.licenseUrl = "";
  }

  static properties = {
    name: {
      attribute: "name",
    },

    href: {
      attribute: "href",
    },

    author: {
      attribute: "author",
    },

    license: {
      attribute: "license",
    },

    licenseUrl: {
      attribute: "license-url",
    },
  };

  render() {
    const licenseUrl =
      this.licenseUrl ||
      licenseUrls[this.license] ||
      "";

    return html`
      <slot>
        <a
          class="attribution-link"
          target="_blank"
          href=${this.href}
        >
          ${this.name}
        </a>

        by ${this.author}

        ${
          this.license
            ? html`
                is licensed under

                <a
                  class="attribution-link"
                  target="_blank"
                  href=${licenseUrl}
                >
                  ${this.license}
                </a>
              `
            : null
        }
      </slot>
    `;
  }

  static styles = css`
    :host {
      font-size: 0.7em;
      color: #9c9c9c;
    }

    a,
    ::slotted(a) {
      color: inherit;
    }
  `;
}

customElements.define(
  "travel-attribution",
  TravelAttribution
);

// ---------------------------------------------------------------------------
// <travel-sights>
// ---------------------------------------------------------------------------

class TravelSights extends LitElement {
  constructor() {
    super();

    this.sights = [];
  }

  static properties = {
    sights: {
      attribute: false,
    },
  };

  render() {
    return this.sights.map(
      place => this.renderPlacesResult(place)
    );
  }

  renderPlacesResult(place) {
    if (
      !place ||
      !place.name ||
      !place.formatted_address
    ) {
      return html`<div></div>`;
    }

    let imageUrl = "";

    if (
      place.photos &&
      place.photos.length > 0
    ) {
      imageUrl =
        place.photos[0].getUrl(
          sightPhotoOptions
        );
    }

    return html`
      <div
        class="sight-item"
        data-place-id="${place.place_id}"
        @click="${this.handleClick}"
      >
        ${
          imageUrl
            ? html`
                <img
                  src="${imageUrl}"
                  class="sight-image"
                  alt="Image for ${place.name}"
                />
              `
            : null
        }

        <div class="sight-info">
          <p>
            ${place.name}
          </p>

          <travel-rating
            stars="${place.rating || 0}"
            reviews="${
              place.user_ratings_total || 0
            }"
          ></travel-rating>

          <p>
            ${place.formatted_address}
          </p>
        </div>
      </div>
    `;
  }

  handleClick(event) {
    const { placeId } =
      event.currentTarget.dataset;

    const place = this.sights.find(
      sight =>
        sight.place_id === placeId
    );

    const selectedEvent =
      new CustomEvent(
        "place-selected",
        {
          bubbles: true,
          composed: true,
          detail: place,
        }
      );

    this.dispatchEvent(
      selectedEvent
    );
  }

  static styles = css`
    :host {
      overflow-y: scroll;
    }

    .sight-item {
      display: flex;
      padding: 1em;
    }

    .sight-item:first-child {
      padding-top: 2em;
    }

    .sight-item:last-child {
      padding-bottom: 2em;
    }

    .sight-item:hover {
      background: #f8f9fc;
      cursor: pointer;
    }

    .sight-image {
      background: #ccc;
      border-radius: 7px;
      flex-shrink: 0;
      height: 70px;
      object-fit: cover;
      width: 85px;
    }

    .sight-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.8em;
      overflow: hidden;
      padding: 0.2em 0;
    }

    .sight-info > p {
      color: #757575;
      font-size: 0.9em;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sight-info > p:first-child {
      color: #000;
      font-size: 1.1em;
    }
  `;
}

customElements.define(
  "travel-sights",
  TravelSights
);

// ---------------------------------------------------------------------------
// <travel-restaurant>
// ---------------------------------------------------------------------------

class TravelRestaurant extends LitElement {
  static properties = {
    place: {
      attribute: false,
    },
  };

  render() {
    if (!this.place) {
      return html`<div></div>`;
    }

    const {
      rating,
      user_ratings_total,
      name,
      vicinity,
    } = this.place;

    let attribution;
    let imageUrl = "";

    if (
      this.place.photos &&
      this.place.photos.length > 0
    ) {
      const photo =
        this.place.photos[0];

      imageUrl =
        photo.getUrl(
          restaurantPhotoOptions
        );

      attribution = unsafeHTML(
        photo.html_attributions[0]
      );
    }

    return html`
      <img
        src="${imageUrl}"
        alt="${name}"
        class="restaurant-image"
      />

      <div class="restaurant-heading">
        ${name}
      </div>

      <travel-rating
        stars=${rating}
        reviews=${user_ratings_total}
      ></travel-rating>

      <span class="restaurant-vicinity">
        ${vicinity}
      </span>

      <div
        class="additional-info-container"
      >
        <div
          class="additional-info-circle"
        ></div>

        <div
          class="additional-info-line"
        ></div>

        <div
          class="additional-info-circle"
        ></div>

        <div
          class="additional-info-line"
        ></div>

        <div
          class="additional-info-circle"
        ></div>

        <div
          class="additional-info-line"
        ></div>
      </div>

      ${
        attribution
          ? html`
              <div
                class="attribution-container"
              >
                <div>
                  Image by ${attribution}
                </div>
              </div>
            `
          : ""
      }
    `;
  }

  static styles = css`
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
}

customElements.define(
  "travel-restaurant",
  TravelRestaurant
);