import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const sightPhotoOptions: google.maps.places.PhotoOptions = {
  maxHeight: 150,
  maxWidth: 200,
};

@customElement('travel-sights')
export default class TravelSights extends LitElement {
  @property({ attribute: false })
  sights: google.maps.places.PlaceResult[] = [];

  static override styles = css`
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

  override render(): TemplateResult[] {
    return this.sights.map((place) => this.renderPlacesResult(place));
  }

  private renderPlacesResult(place: google.maps.places.PlaceResult): TemplateResult {
    if (!place?.name || !place?.formatted_address) {
      return html`<div></div>`;
    }

    let imageUrl = '';
    const photo = place.photos?.[0];
    if (photo) {
      imageUrl = photo.getUrl(sightPhotoOptions);
    }

    return html`
      <div
        class="sight-item"
        data-place-id="${place.place_id}"
        @click="${this.handleClick}"
      >
        ${imageUrl
          ? html`
              <img
                src="${imageUrl}"
                class="sight-image"
                alt="Image for ${place.name}"
              />
            `
          : nothing}

        <div class="sight-info">
          <p>${place.name}</p>

          <travel-rating
            .stars=${place.rating ?? 0}
            .reviews=${place.user_ratings_total ?? 0}
          ></travel-rating>

          <p>${place.formatted_address}</p>
        </div>
      </div>
    `;
  }

  private handleClick(event: MouseEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const placeId = currentTarget?.dataset.placeId;

    if (!placeId) return;

    const place = this.sights.find((sight) => sight.place_id === placeId);

    const selectedEvent = new CustomEvent<google.maps.places.PlaceResult | undefined>(
      'place-selected',
      {
        bubbles: true,
        composed: true,
        detail: place,
      }
    );

    this.dispatchEvent(selectedEvent);
  }
}

// Global Custom Event interface map & tag definition
declare global {
  interface HTMLElementTagNameMap {
    'travel-sights': TravelSights;
  }

  interface HTMLElementEventMap {
    'place-selected': CustomEvent<google.maps.places.PlaceResult | undefined>;
  }
}

if(customElements) customElements.define("travel-sights", TravelSights);