.PHONY: deps
deps:
	npm ci

dist:
	mkdir dist


dist/CNAME:
	cp src/CNAME dist/CNAME


.PHONY: pages
pages:
	npx parcel build src/index.html src/sourdough-guide/index.html

pages-dev:
	npx parcel src/index.html src/sourdough-guide/index.html


.PHONY: build
build: dist dist/CNAME pages
