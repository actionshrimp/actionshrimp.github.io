.PHONY: deps
deps:
	npm ci

dist/index.html:
	npx parcel build src/index.html

dist/CNAME:
	cp src/CNAME dist/CNAME

.PHONY: build
build: dist/CNAME dist/index.html
