.PHONY: test build deploy dev

test:
	cargo test --package supply-hub-contract
	npm test

build-wasm:
	RUSTFLAGS="-C target-feature=-reference-types -C target-cpu=mvp" \
	cargo build --target wasm32v1-none --release --package supply-hub-contract

deploy: build-wasm
	node scripts/deploy-contract.mjs

dev:
	npm run dev
