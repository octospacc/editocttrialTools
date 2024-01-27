(function(){

	var documentData = document.documentElement.dataset;

	function ToggleElemDisplay (elem) {
		elem.style.display = (!elem.style.display ? 'revert' : '');
	}

	document.querySelector('div.navbar__items > button.navbar__toggle')./*addEventListener('click',*/onclick= function(){
		//ToggleElemDisplay(document.querySelector('aside.theme-doc-sidebar-container'));
		Array.from(document.querySelectorAll('div[class*="docRoot_"] > aside.theme-doc-sidebar-container')).forEach(function(elem){
			ToggleElemDisplay(elem);
		});
	};//);

	var themeButtonElem = document.querySelector('div[class*="colorModeToggle_"] > button');
	themeButtonElem.disabled = false;
	themeButtonElem./*addEventListener('click',*/onclick= function(){
		documentData.theme = (!documentData.theme || documentData.theme === 'light' ? 'dark' : 'light');
		localStorage.setItem('theme', documentData.theme);
		var lightStyle = document.querySelector(`div.navbar__logo > img[class*="light"]`).style;
		var darkStyle = document.querySelector(`div.navbar__logo > img[class*="dark"]`).style;
		switch (documentData.theme) {
			case 'light':
				lightStyle.display = 'unset';
				darkStyle.display = 'none';
			break;
			case 'dark':
				lightStyle.display = 'none';
				darkStyle.display = 'unset';
			break;
		}
	};//);

	if (!['light', 'dark'].includes(documentData.theme)) {
		documentData.theme = 'light';
	}

	window.addEventListener('load', function(){

		var desktopTocQuery = 'div.theme-doc-toc-desktop';
		var mobileTocQuery = 'div.theme-doc-toc-mobile';
		Array.from(document.querySelectorAll('div[class*="docRoot_"]')).forEach(function(docElem){
			var mobileTocElem = /*document*/docElem.querySelector(`${mobileTocQuery}`);
			if (mobileTocElem) {
				mobileTocElem.innerHTML += /*document*/docElem.querySelector(`${desktopTocQuery}`).outerHTML;
				var newTocElem = mobileTocElem.querySelector(`${desktopTocQuery}`);
				var newTocListElem = newTocElem.querySelector('ul');
				newTocListElem.className = newTocListElem.className.replaceAll('table-of-contents__left-border', '');
				/*document*/docElem.querySelector(`${mobileTocQuery} > button`)./*addEventListener('click',*/onclick= function(){
					ToggleElemDisplay(newTocElem);
				};//);
			}
		});

	});

})();
