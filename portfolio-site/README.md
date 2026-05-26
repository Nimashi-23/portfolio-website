# Portfolio Site

This is a static portfolio site scaffolded for you. Features:

- Hero, About, Skills, Projects, Contact sections
- Project filters and modal details
- Dark / Light theme toggle (persisted)
- Smooth scrolling and responsive layout

To view locally:

1. Open `c:\Users\MTC\Documents\Portfolio new\portfolio-site\index.html` in your browser.

To deploy to GitHub Pages:

1. Create a new repository and push this folder as the repository root.
2. Enable GitHub Pages from `Settings › Pages` and select the `main` branch.

Customize the content in `index.html`, replace images in `assets/img`, and update `assets/css/styles.css` to match your brand.

Replace profile image
- Save your CV/profile image into `assets/img/profile.png` (overwrite existing placeholder). Example PowerShell command:

```powershell
Copy-Item 'C:\path\to\your\cv-image.png' -Destination 'c:\Users\MTC\Documents\Portfolio new\portfolio-site\assets\img\profile.png' -Force
```

Then open the site locally:

```powershell
ii 'c:\Users\MTC\Documents\Portfolio new\portfolio-site\index.html'
```

If your browser still shows the old image, clear cache or do a hard reload (Ctrl+F5).
