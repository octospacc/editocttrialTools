# Manual Setup

(To be finished)

In short, download the following files from the source repo and place them in the respective paths of your existing Docusaurus site:
* `docusaurus-static-postprocess.js`
* `src/docusaurus-static/single-file.html`
* `static/docusaurus-static.css`
* `static/docusaurus-static.js`

Then, add these lines to the to of the `scripts` section of your existing `package.json` file:
```json
    "postprocess": "echo Postprocessing... && node ./docusaurus-static-postprocess.js && echo Done!",
    "build+postprocess": "docusaurus build && npm run postprocess",
```

Now you can build your Docusaurus-Static site with `npm run build+postprocess`.
