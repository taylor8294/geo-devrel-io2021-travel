# Google Maps WebGL Demo

The source of Google Maps Platform's **WebGL-powered Travel Demo**, originally presented at **Google I/O 2021**.

![](/dist/static/travel/images/share.png)

This project archives and updates the interactive travel showcase originally hosted at [geo-devrel-io2021-travel.web.app](https://geo-devrel-io2021-travel.web.app/). It serves as a useful reference implementation for developers wanting to explore full 3D vector maps, custom camera control, and WebGL object overlays using the Maps JavaScript API.

Compared to the original demo, the code here has been updated to work with the latest versions of the Maps JavaScript API and third-party libraries.

The original Google Developer Relations demo illustrates a trip itinerary using 3D map controls and WebGL model integrations

- Runtime manipulation of map heading, tilt angle, altitude, and camera parameters.
- Integration with the GPU-accelerated WebGL rendering context of the vector basemap to display 3D models (e.g., plane and taxi models) occluded correctly within map geometry.
- Programmatic, smooth camera movement.

## 🛠️ Getting Started

### Prerequisites

- A **Google Maps Platform API Key** with the **Maps JavaScript API** enabled and **Vector Map ID** capability.
- Node.js (v18 or higher) and `npm` or `yarn`.

You can follow the instructions under "Get set up" within the [Build 3D map experiences with WebGL Overlay View](https://developers.google.com/codelabs/maps-platform/webgl#0) codelab for a step-by-step guide of what to do within your Google Cloud Platform account.

### Installation

1. **Clone the repository and install dependencies**
   ```bash
   git clone https://github.com/taylr8294/geo-devrel-io2021-travel.git
   cd geo-devrel-io2021-travel
   npm install
   mv .env.example .env
   ```

2. **Configure Environment Variables**<br>
Add your **Google Maps Platform API Key** and **Vector Map ID** to the `.env` file.

(Note: Ensure your Map ID is configured with Vector Map capabilities in the Google Cloud Console for 3D/WebGL support).

3. **Build and serve the `dist` directory**
   ```bash
   npm run watch
   ```
Point your favorite development server at the `dist/` directory to see the demo in your browser.

## ⚖️️ License & Attribution

> This repository is an unofficial project created solely for educational, archival, and reference purposes to demonstrate WebGL capabilities in mapping on the web. This project is not affiliated with, sponsored by, endorsed by, or associated with Google LLC, Google Maps Platform, or any of their subsidiaries or affiliates. All product names, logos, brands, trademarks, and registered trademarks — including *"Google"*, *"Google Maps"*, and *"Google Maps Platform"* — are the property of their respective owners. Any third-party 3D asset licenses (e.g., CC-BY assets used in the original Google demo) belong to their respective creators.
>

License: MIT