# Immediate Setup

If you're a beginner to all of this, don't have many requirements, or don't already have a prior Docusaurus usage, it's recommended that you follow this immediate setup to get started.

First, download and unpack the latest source archive for this exact site from [https://gitlab.com/octospacc/editocttrialTools/-/archive/main/editocttrialTools-main.zip?path=docusaurus-static](https://gitlab.com/octospacc/editocttrialTools/-/archive/main/editocttrialTools-main.zip?path=docusaurus-static).

Only for the first time, run `npm install` in the main extracted directory, to install all needed dependencies.

You can now run your site in development mode with `npm run start`, just like with standard Docusaurus. Edit files in `/docs/` or `/blog/` to test out everything or to write your real content, and watch changes being rendered.

Anytime you want to create an actual static build of the site, good for both remote deployment and local usage, run `npm run build+postprocess`. You will find your output in the `/build/` directory by default.
