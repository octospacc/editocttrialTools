'use strict';

// this script is based on <https://github.com/facebook/docusaurus/issues/448#issuecomment-908777029>, with the following changes:
// * fixed directory mis-detection for "index.html" path adjustments
// * added HTML injections
// * added build of single-file app
// TODO: local search
// TODO: should we try to un-inline scripts (and styles, but idk if they could exist) if they're always the same, to save on resources?

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const recursiveReaddir = require('recursive-readdir');

const buildDirectory = path.join(__dirname, 'build');
const absoluteUrlRegExp = /(href|src)="(?!http[s]|ftp?:\/\/)([^"|#]+)"/g;
const websiteTextualFileExtensions = ['.css', '.js', '.html', '.xml'];

const isDirectoryPath = dirPath => path.extname(dirPath) === '';
const isNotWebsiteTextualFile = (filePath, stats) => !(stats.isDirectory() || websiteTextualFileExtensions.includes(path.extname(filePath)));

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
	const injects = await loadInjects();
	const filePaths = await recursiveReaddir(buildDirectory);//[isNotWebsiteTextualFile]);
	const singleFileStream = await fs.createWriteStream(path.join(buildDirectory, 'docusaurus-static-single-file.html'), { flags: 'a' });
	const singleFileHtml = /*convertAbsolutePathsToRelative(*/patchHtml(await fs.readFile(getMainHtmlFile(filePaths), 'utf8'), injects);//, path.relative(buildDirectory, getMainHtmlFile(filePaths)));
	await singleFileStream.write(singleFileHtml.split('<div class="docRoot_')[0]);
	await Promise.all(
		filePaths.map(async filePath => {
			const relativePath = path.relative(buildDirectory, filePath);
			let content = await fs.readFile(filePath, 'utf8');
			if (path.extname(filePath) === '.html') {
				content = patchHtml(content, injects);
				if (content.split('<div class="docRoot_')[1]) {
					await singleFileStream.write(`<div data-docusaurus-static-path="/${relativePath.replaceAll('"', '&quot;').slice(0, -'index.html'.length)}" class="docRoot_` + content.split('<div class="docRoot_')[1].split('</main></div>')[0] + '</main></div>');
				}
				await fs.writeFile(filePath, convertAbsolutePathsToRelative(content, relativePath));
			} else if (path.extname(filePath) === '.css') {
				await singleFileStream.write(`<style>${content}</style>`);
			} else if (path.extname(filePath) === '.js') {
				// include any script, except for React ones, they break the app when used in the single-file
				if (!relativePath.startsWith('assets/js/')) {
					await singleFileStream.write(`<script>${content}</script>`);
				}
			} else {
				await singleFileStream.write(`<script>window["docusaurus-static"].inlineDataFiles["${relativePath.replaceAll('"', '&quot;')}"]="data:${mime.lookup(filePath)};base64,${btoa(unescape(encodeURIComponent(content)))}";</script>`);
			}
		})
	);
	await singleFileStream.write(injects['single-file'] + singleFileHtml.split('</main></div>')[1]);
	await singleFileStream.end();
};

postProcess();
