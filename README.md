# AP Chemistry Practice

A browser-based study game for nomenclature, periodic trends, and solubility guidelines.

Play at **https://luca-flood.github.io/ap-chem-practice/**.

## Practice decks

- **Naming:** ions, ionic compounds, molecular compounds, and acids; practice names or formulas.
- **Trends:** atomic and ionic radii, electronegativity, electron affinity, and ionization energies.
- **Solubility:** classify 99 ionic compounds using [Mr. Thaler’s 2016 guidelines](https://www.mrthaler.net/uploads/6/5/4/3/65431157/solubility_guidelines_rev_2016.pdf) for water at 25°C. Answer `y` for soluble or `n` for insoluble/slightly soluble; explanations preserve the distinction and identify the rule. Each 200-card queue contains 120 exceptions and 80 standard-rule examples when both types are selected, with six exceptions per ten-card block. Filters that leave only one type use that type exclusively.

Each deck supports randomized queues and flashcards. Progress and missed-question statistics are saved locally in each browser; no account or server is required. Progress on another website or device does not automatically transfer.

## Run or update

Open `index.html` in a browser, or serve this directory with a static web server. No build step or dependencies are required.

Run the solubility classification and queue checks with `node tests/solubility.test.cjs`.

GitHub Pages publishes from the root of the `main` branch. Updating `index.html` on that branch updates the hosted game after deployment finishes.

Solubility answers follow the linked classroom chart, including its mercury, strontium-hydroxide, and sulfide conventions. Statistics for this revised deck have separate question IDs from the earlier guideline set; existing practice history is retained. This is an independent study tool, not affiliated with College Board.
