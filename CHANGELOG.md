# Changelog

## [1.3.3](https://github.com/wrcp20/claude-apikey-chat/compare/v1.3.2...v1.3.3) (2026-04-04)


### Bug Fixes

* **ci:** ejecutar solo en pull_request, no en push a main ([ecabeb9](https://github.com/wrcp20/claude-apikey-chat/commit/ecabeb9b2346a9a767fed81a4f6512b3bae1bc30))

## [1.3.2](https://github.com/wrcp20/claude-apikey-chat/compare/v1.3.1...v1.3.2) (2026-04-04)


### Bug Fixes

* **deploy:** trigger staging via workflow_run after Release completes ([7580bb3](https://github.com/wrcp20/claude-apikey-chat/commit/7580bb3315a68fc3b128eec07380be366e740dad))

## [1.3.1](https://github.com/wrcp20/claude-apikey-chat/compare/v1.3.0...v1.3.1) (2026-04-04)


### Bug Fixes

* **deploy:** assign runners and environments to staging and production workflows ([b5638a9](https://github.com/wrcp20/claude-apikey-chat/commit/b5638a97b5dd5711fabced93c3268a875bc39376))

## [1.3.0](https://github.com/wrcp20/claude-apikey-chat/compare/v1.2.0...v1.3.0) (2026-04-03)


### Features

* **ci:** reemplazar deploy.yml por deploy-staging y deploy-production ([53baa23](https://github.com/wrcp20/claude-apikey-chat/commit/53baa23e027ca7307c2c6d9dc9c3de7d84baf1d4))


### Bug Fixes

* **ci:** agregar workflow_dispatch para poder probar deploy manualmente ([d5c8153](https://github.com/wrcp20/claude-apikey-chat/commit/d5c81533785fb94343044747a7d28c29c5f9a544))
* **ci:** usar vars.DEPLOY_PATH y vars.DEPLOY_PORT en deploy workflow ([a721b9a](https://github.com/wrcp20/claude-apikey-chat/commit/a721b9a4d97cb6858c756853b238f9b37f5f096a))

## [1.2.0](https://github.com/wrcp20/claude-apikey-chat/compare/v1.1.0...v1.2.0) (2026-04-03)


### Features

* **ci:** agregar workflow de deploy automatico via self-hosted runner ([2ca6f26](https://github.com/wrcp20/claude-apikey-chat/commit/2ca6f264a7c37ecbdbca6cb448c50860ae1c4935))

## [1.1.0](https://github.com/wrcp20/claude-apikey-chat/compare/v1.0.0...v1.1.0) (2026-04-03)


### Features

* **backend:** agregar endpoint /api/models con lista de modelos disponibles ([837a5f1](https://github.com/wrcp20/claude-apikey-chat/commit/837a5f131b00478562129c7dea5c9e7a985de51f))


### Bug Fixes

* **backend:** agregar version en respuesta de /api/status ([1ff0c93](https://github.com/wrcp20/claude-apikey-chat/commit/1ff0c93d62f2e4656262114afa3f2a0000c77cfd))

## 1.0.0 (2026-04-03)


### Features

* initial commit — chat Claude con Anthropic API Key ([4ab64ee](https://github.com/wrcp20/claude-apikey-chat/commit/4ab64ee9f58981c96fd129ef0a8ed2450d6e100c))


### Bug Fixes

* **ci:** reemplazar if secrets por continue-on-error en notify-discord ([1732bed](https://github.com/wrcp20/claude-apikey-chat/commit/1732bed2bd636cce4d941effcd15ee0d535c28e2))
