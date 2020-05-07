// Algolia vars
const appId = 'H10LQ4I695';
const publicKey = 'b57c0b5231fd34f2077cf00e76cc8f8e';
const index = 'dgraph_blog';

let showSearch = true;
let widgetContainer = {};

// Toggles search interface's visibility
const toggleVisibility = () => {
	showSearch = !showSearch;

	var $container = document.querySelector('.page-search');

	if ($container) {
		if (showSearch) {
			$container.classList.add('is-active');
		} else {
			$container.classList.remove('is-active');
		}
	}

	var $results = document.querySelector('.page-search__results');

	if ($results) {
		$results.style.display = showSearch ? "" : "none";
	}

	var $input = document.querySelector('.page-search__input');

	if ($input) {
		$input.style.display = showSearch ? "" : "none";

		if (showSearch) {
			$input.focus();
		}
	}

	var $body = document.querySelector('.post-grid');

	if ($body && !showSearch) {
		$body.style.display = '';
	}

	var $pagination = document.querySelector('.pagination');

	if ($pagination && !showSearch) {
		$pagination.style.display = '';
	}
}

const parseSummary = (summary) => summary.trim().replace("<p>", "").replace("</p>", "");

// Renders tags
const renderTags = tags => tags.map(tag => `
	<a href="/blog/tags/${tag.toLowerCase()}">
		${tag.toLowerCase()}
	</a>
`).join('')

// Helper for the render function
const renderIndexListItem = ({ indexId, hits }) => `
<div>
	<h2 class="page-search__header">
		${hits.length} results found.
	</h2>

  	<ol>
		${hits.filter(hit => 'page' === hit.kind).map(
				hit =>
				`<div class="page-search__item">
					<h3 class="post__title">
						<a href="${hit.permalink}">
							${instantsearch.highlight({ attribute: 'title', hit })}
						</a>
					</h3>
					<div class="post__summary">
						${parseSummary(hit.summary)}
					</div>
					${ hit.tags && `
						<div class="post__tags">
							<div>${renderTags(hit.tags || [])}</div>
						</div>
					` || '' }
				</div>`
			)
			.join('')}
  	</ol>
</div>
`;

// Create the render function
const renderAutocomplete = (renderOptions, isFirstRender) => {
	const { indices, currentRefinement, refine, widgetParams } = renderOptions;

	if (isFirstRender) {
		const input = document.createElement('input');
		const ul = document.createElement('div');

		ul.className = "page-search__results";
		input.className = "page-search__input";

		input.placeholder = "Search...";

		input.addEventListener('input', event => {
			refine(event.currentTarget.value);
		});

		widgetContainer = widgetParams.container;

		widgetContainer.insertBefore(input, widgetContainer.firstChild);
		widgetContainer.appendChild(ul);

		toggleVisibility();
	}

	widgetContainer.querySelector('input').value = currentRefinement;

	if (currentRefinement) {
		widgetContainer.querySelector('.page-search__results').style.display = "";
		widgetContainer.querySelector('.page-search__results').innerHTML = indices
			.map(renderIndexListItem)
			.join('');
	} else {
		widgetContainer.querySelector('.page-search__results').innerHTML = "";
		widgetContainer.querySelector('.page-search__results').style.display = "none"
	}

	var $body = document.querySelector('.post-grid');

	if ($body) {
		$body.style.display = !!currentRefinement ? "none" : "";
	}

	var $pagination = document.querySelector('.pagination');

	if ($pagination) {
		$pagination.style.display = !!currentRefinement ? "none" : "";
	}
};

const createSearch = () => {
	// Create the custom widget
	const customAutocomplete = instantsearch.connectors.connectAutocomplete(
		renderAutocomplete
	);

	// Algolia client
	const client = algoliasearch(appId, publicKey);

	const search = instantsearch({
		indexName: index,
		searchClient: client,
	});
	search.addWidgets([
		customAutocomplete({
			container: document.querySelector('.page-search'),
		})
	]);

	search.start();
};

window.addEventListener('DOMContentLoaded', function() {
	if (document.querySelector('.page-search')) {
		createSearch();
	}
});
