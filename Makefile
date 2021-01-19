default: run

build:
	@echo "Generating a build..."
	mkdir dist
	deno bundle server.ts dist/server

clean:
	@echo "Cleaning the dist directory..."
	rm -rf dist

debug:
	@echo "Starting debugging..."
	deno run -A --inspect-brk server.ts

run:
	@echo "Starting application..."
	deno run --allow-net --allow-read server.ts
	#deno run --allow-env --allow-read --config tsconfig.json server.ts
	
test:
	@echo "Running tests..."
	deno test