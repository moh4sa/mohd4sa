# Mohammed Alshehri — Personal Website

A single-page personal website built with plain HTML, CSS and JavaScript (no frameworks or build step).

## Structure

```
index.html            Page markup and meta tags
assets/css/style.css  All styles (dark theme, responsive, reduced-motion aware)
assets/js/main.js     Typewriter effect and contact form
assets/images/        Hero image (WebP + JPEG fallback) and favicon
```

## Run locally

Any static file server works, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact form

Messages are sent through [EmailJS](https://www.emailjs.com/). The public key, service ID and
template ID are at the top of `assets/js/main.js`. The template receives the `name`, `email`,
`title` and `message` fields.

To prevent abuse, restrict the public key to your domain in the EmailJS dashboard
(Account → Security → Allowed origins).

## Updating the hero image

```sh
sips -Z 2133 original.jpg --out /tmp/h1600.jpg && sips -Z 1067 original.jpg --out /tmp/h800.jpg
cwebp -q 78 /tmp/h1600.jpg -o assets/images/home-1600.webp
cwebp -q 78 /tmp/h800.jpg  -o assets/images/home-800.webp
sips -s formatOptions 75 /tmp/h1600.jpg --out assets/images/home-1600.jpg
```

## Credits

Originally based on a template by [ismailtasdelen](https://github.com/ismailtasdelen).
