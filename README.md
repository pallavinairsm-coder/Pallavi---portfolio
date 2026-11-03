# Pallavi Nair SM — Portfolio

A responsive static portfolio with project case-study popups and a browser-based content editor. No local installation required.

## Upload to GitHub

1. Extract the ZIP.
2. In the existing `Pallavi---portfolio` repository, choose **Add file → Upload files**.
3. Upload `index.html`, `editor.html`, `style.css`, `script.js`, `content.js`, `editor.js` (and optionally this README). Keep them at the repository root.
4. Commit changes.
5. In **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then Save. GitHub Pages will provide the public URL after deployment.

## Edit content without touching code

Open `editor.html` on your published site. Edit project fields, experience, contact links, and certifications. Click **Save local preview** to see the changes on the same browser. When ready, click **Download content.js**, upload it to GitHub to replace the previous `content.js`, and commit. The published site updates after Pages redeploys.

**Important:** This editor is not authenticated and is intentionally local-only. Anyone can open the editor page, but they cannot publish to your GitHub repository without repository permissions. Local previews are stored only in the browser. This is a content editor, **not an AI prompt editor**. AI-assisted code changes can be added through a separate browser AI tool later.

## Personalize

- The photo placeholder can be replaced later with `images/profile.jpg` and a small change to `index.html`.
- Project screenshots can be uploaded to an `images/` folder and their paths entered in the editor.
- The portfolio project descriptions are intentionally cautious and avoid invented quantitative results.
- Never upload `.env`, tokens, passwords, or other secrets to a public GitHub repository.
