'use strict';

// this script is based on <https://github.com/facebook/docusaurus/issues/448#issuecomment-908777029>, with the following changes:
// * fixed directory mis-detection for "index.html" path adjustments
// * added HTML injections
// * added build of single-file app
// TODO: local search
// TODO: the navbar should be adjusted for small screens to view all possible buttons, maybe with horizontal scrolling, or else they should be relocated somewhere
// TODO: should we try to un-inline scripts (and styles?) from HTML pages if they're always the same, and load them from a file. to save on resources and allow caching?

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const recursiveReaddir = require('recursive-readdir');
const cheerio = require('cheerio');

const buildDirectory = path.join(__dirname, 'build');
const absoluteUrlRegExp = /(href|src)="(?!http[s]|ftp?:\/\/)([^"|#]+)"/g;
const websiteTextualFileExtensions = ['.css', '.js', '.html', '.xml'];

const isDirectoryPath = dirPath => path.extname(dirPath) === '';

const convertAbsolutePathsToRelative = (content, filePath) => content.replace(absoluteUrlRegExp, (_absoluteUrl, $1, $2) => {
	const currentDirPath = path.dirname(filePath);
	const relativeDirPath = currentDirPath === '.' ? '.' : path.relative(currentDirPath, '');
	let relativePath = path.join(relativeDirPath, $2);
	let relativePathCheck = relativePath;
	while (relativePathCheck.startsWith('../')) {
		relativePathCheck = relativePathCheck.slice('../'.length);
	}
	relativePathCheck = path.join(buildDirectory, relativePathCheck);
	if ((fs.existsSync(relativePathCheck) && fs.lstatSync(relativePathCheck).isDirectory()) || isDirectoryPath(relativePath)) {
		relativePath = path.join(relativePath, 'index.html');
	}
	return `${$1}="${relativePath}"`;
});

const getMainHtmlFile = (filePaths) => {
	if (filePaths.includes(path.join(buildDirectory, 'index.html'))) {
		return path.join(buildDirectory, 'index.html');
	} else {
		for (const file of filePaths) {
			if (path.extname(file) === '.html') {
				return file;
			}
		}
	}
};

const loadInjects = async () => {
	const injects = { head: "", body: "", "single-file": "" };
	for (const inject in injects) {
		const injectFile = path.join(buildDirectory, '..', 'src', 'docusaurus-static', `${inject}.html`);
		if (fs.existsSync(injectFile)) {
			injects[inject] = await fs.readFile(injectFile, 'utf8');
		}
	}
	return injects;
};

const patchHtml = (html, injects) => html
	.replaceAll('</head>', '<script> window["docusaurus-static"] = { inlineDataFiles: {} }; </script></head>')
	.replaceAll('</body>', '<link rel="stylesheet" href="/docusaurus-static.css"/><script src="/docusaurus-static.js"></script></body>')
	.replaceAll('<div class="navbar__items">', '<div class="navbar__items"><button aria-label="Toggle navigation bar" aria-expanded="false" class="navbar__toggle clean-btn" type="button"><svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"></path></svg></button>')
	.replaceAll('</head>', `${injects.head}</head>`)
	.replaceAll('</body>', `${injects.body}</body>`)
;

const postProcess = async () => {
	const htmlPagePlacehold = '<docusaurus-static class="postprocess-tmp"></docusaurus-static>';
	const injects = await loadInjects();
	const filePaths = await recursiveReaddir(buildDirectory);
	const singleFileStream = await fs.createWriteStream(path.join(buildDirectory, 'docusaurus-static-single-file.html'), { flags: 'a' });
	const singleFileDom = cheerio.load(patchHtml(await fs.readFile(getMainHtmlFile(filePaths), 'utf8'), injects));
	singleFileDom('div.main-wrapper').replaceWith(htmlPagePlacehold);
	await singleFileStream.write(singleFileDom('html').prop('outerHTML').split(htmlPagePlacehold)[0]);
	await Promise.all(
		filePaths.map(async filePath => {
			const relativePath = path.relative(buildDirectory, filePath);
			let content = await fs.readFile(filePath);
			if (path.extname(filePath) === '.html') {
				content = String(content);
				content = patchHtml(content, injects);
				await fs.writeFile(filePath, convertAbsolutePathsToRelative(content, relativePath));
				if (filePath.split(path.sep).slice(-1)[0] === 'index.html') {
					const contentDom = cheerio.load(content);
					contentDom('div.main-wrapper').prop('data-docusaurus-static-path', `/${relativePath.slice(0, -'index.html'.length)}`);
					await singleFileStream.write(contentDom('div.main-wrapper').prop('outerHTML'));
				}
			} else if (path.extname(filePath) === '.css') {
				await singleFileStream.write(`<style>${content}</style>`);
			} else if (path.extname(filePath) === '.js') {
				// include any script, except for React ones, they break the app when used in the single-file
				if (!relativePath.startsWith('assets/js/')) {
					await singleFileStream.write(`<script>${content}</script>`);
				}
			} else {
				await singleFileStream.write(`<script>window["docusaurus-static"].inlineDataFiles["${relativePath.replaceAll('"', '&quot;')}"]="data:${mime.lookup(filePath)};base64,${content.toString('base64')}";</script>`);
			}
		})
	);
	await singleFileStream.write(injects['single-file'] + singleFileDom('html').prop('outerHTML').split(htmlPagePlacehold)[1]);
	await singleFileStream.end();
};

postProcess();
