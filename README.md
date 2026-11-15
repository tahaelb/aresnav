# ARES-NAV · Habitat & EVA Mission Planner

An interactive Mars mission planner centred on Gale Crater. It has an animated loading screen, a 3D orbital globe of Mars, a local terrain view of Mount Sharp, and an EVA route planner (EVA-04, Boxwork Ridge Traverse) with map layers and a helmet visor HUD.

**Live site:** https://aresnav.netlify.app/aresnav

## How it works

The project is two separate pages:

1. `index.html` is the loading screen. It plays the globe animation and shows a typewriter prompt. Press any key (or tap) and the globe slides into place, then the main page opens.
2. `AresNav.html` is the main app. If you refresh it or open it directly, it sends you back to the loading screen.

## Files

```
├── index.html          Loading screen (entry page)
├── AresNav.html        Main app
├── mission-data.js     Mission data used by the app
└── data/
    ├── gale-dem.js     Gale Crater terrain heights
    └── gale-opt.jpg    Gale Crater surface image
```

`convert_tif_lite.py` is the helper script that was used to turn a raw GeoTIFF into the files in `data/`. It is not needed to run the site, and the raw `.tif` is not stored in this repository.

## Run it on your machine

You need a modern browser, an internet connection, and any simple local web server.

1. **Get the files**
   ```
   git clone https://github.com/tahaelb/aresnav.git
   cd aresnav
   ```
   Or click **Code → Download ZIP** on GitHub and unzip it.

2. **Start a local server** from inside the folder. Pick one:

   - Python 3:
     ```
     python -m http.server 8000
     ```
   - Node.js:
     ```
     npx serve
     ```
   - VS Code: install the **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**.

3. **Open** http://localhost:8000/ in your browser (use the address your server prints if it is different).

### Why not just double-click `index.html`?

Opening the file directly (`file://`) mostly works, but browsers block some features there. The app cannot read `data/gale-opt.jpg` into its terrain colouring, and the page-to-page handoff and the refresh redirect depend on the browser treating both pages as the same site. Always use a local server.

## Requirements

- **Internet connection.** three.js and the Space Grotesk font load from CDNs, and the app can fetch live NASA data (images and Curiosity photos). Without a connection the pages may not run, and live data will not load.
- **Browser.** Current Chrome, Edge or Safari give the smoothest result. The cross-fade between the two pages uses a newer browser feature. Firefox works but uses a short fade to dark instead.
- **WebGL** must be enabled, since the globe and terrain are 3D.

## Troubleshooting

- **Blank page or missing terrain.** Open the browser console (F12) and look for red "404" lines. They name any file that is missing or has the wrong capitalisation. File names are case-sensitive on GitHub Pages.
- **Refresh sends you to the loading screen.** This is intentional.
- **Old version showing.** Hard refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac), or use a private window.

## Updating the live site

```
git add .
git commit -m "update"
git push
```

GitHub Pages republishes automatically after a minute or two.
