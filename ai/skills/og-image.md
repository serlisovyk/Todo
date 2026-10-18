---
name: og-image
description: Use when the link preview card (public/og-image.png) must be made again after a palette, list card or author name change, or when the favicon's colours change.
---

# Preview card and favicon

`public/og-image.png` is the card `og:image` and `twitter:image` name in `index.html`: the app's own task list, half in
each theme, with the logo and the author's name (decision `vercel-and-link-previews`). No source of it is stored.
Remake it when the palette, the list card (`todo-list`, `todo-item`, `icon-button`) or the author's name changes.

## The scene, 1200×630

- A straight diagonal runs from the bottom-left corner to the top-right one. Above it is the dark theme's
  `--color-page`, below it the light theme's.
- Centred, the list card with four sample tasks of different categories and priorities, the last one checked. The
  diagonal cuts it in half, and each half is drawn in its own theme.
- Top left, in the dark triangle, the header's logo (`ListChecks` and «Todo») scaled up; bottom centre, in the light
  one, «Serhii Lisovyk» in `--color-text-muted`; both 40px or more from the edges. No tagline, toolbar or second icon.

## Make it

1. Copy the real markup: in `pnpm preview` seed `todo:data` with the four tasks (`{ version, todos }` with
   `DATA_FORMAT_VERSION`; `sanitizeTodo` lists a task's fields), reload, and copy the `outerHTML` of `ul.todo-list`, `.app-header-icon` and `.app-header-title`. Set the `checked`
   attribute on the checked input: React sets the property, not the attribute.
2. In the scratchpad write a throwaway page. `tokens.css` sets a theme on `:root[data-theme]` only, so the halves are
   two full-size iframes of two pages, each with its own `data-theme`: the dark one below, the light one on top with
   `clip-path: polygon(100% 0, 100% 100%, 0 100%)`. Each page links `src/styles/{tokens,colors,base}.css` and the
   stylesheets of the header, `icon-button`, `todo-list` and `todo-item` by `file:///` URL, declares Inter again with
   the file URL of `public/fonts/inter.woff2` (`base.css` points at `/fonts`), and centres the card at about 1.05× zoom.
   Colours are tokens, never hex; the pages size themselves to the viewport.
3. Render the outer page with headless Chrome (a `file:///` URL, an absolute screenshot path), then delete the profile:

   ```powershell
   & 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --force-color-profile=srgb --window-size=1200,630 --virtual-time-budget=3000 --user-data-dir=$env:TEMP\og-chrome --screenshot="$PWD\public\og-image.png" file:///C:/path/to/scene.html
   ```

4. Check it on `pnpm preview`, in the console of `/`:

   ```js
   const image = await createImageBitmap(await (await fetch('/og-image.png')).blob())
   const { width, height } = image
   const context = new OffscreenCanvas(width, height).getContext('2d')
   context.drawImage(image, 0, 0)
   const { data } = context.getImageData(0, 0, width, height)
   const pixel = (x, y) =>
     data.slice((y * width + x) * 4, (y * width + x) * 4 + 3).join()
   const isDark = (x, y) => y / height + x / width < 1
   ```

   The size is exactly 1200×630 and the file under 200 KB. Sample the page colour about 14px either side of the
   diagonal, clear of the card, at x = 40, 90 and 150: above it `14,14,17`, below it `244,244,246`. Scan for pixels that
   differ from the page colour in the logo's corner and around the name: every corner of the logo's bounding box has
   `isDark` true, every corner of the name's has it false.

5. If the words of the scene changed, change `og:image:alt` and `twitter:image:alt` in `index.html` to match.

The same scene rendered with `--window-size=1280,640` into another file is the 1280×640 GitHub social preview.

`public/favicon.svg` is written by hand. An SVG icon cannot read the page's custom properties, so its two stroke
colours are literals that must equal `--color-accent` on `:root` and on `:root[data-theme='dark']` in `tokens.css`.
