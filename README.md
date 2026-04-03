# Chat Claude — API Key

Chat web que usa tu **ANTHROPIC_API_KEY** directamente con el SDK oficial de Anthropic. Sin OAuth, sin CLI, SDK directo.

> **Uso personal y local.** Lee la seccion de seguridad antes de exponer a la red.

---

## Tabla de contenido

- [Como funciona](#como-funciona)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalacion y modos de uso](#instalacion-y-modos-de-uso)
- [Frontends disponibles](#frontends-disponibles)
- [Variables de entorno](#variables-de-entorno)
- [Modelos disponibles](#modelos-disponibles)
- [Seguridad — Leer antes de usar](#seguridad--leer-antes-de-usar)
- [Advertencias al subir a GitHub](#advertencias-al-subir-a-github)

---

## Como funciona

```
Navegador / Flutter
      |  HTTP + SSE
      v
backend/server.js  (Express en :3200)
      |  Anthropic SDK (@anthropic-ai/sdk)
      v
API de Anthropic
```

El backend usa el **SDK oficial de Anthropic** para comunicarse con la API. Cada request crea un stream directo — no hay sesion persistente ni warm-up necesario.

La API key vive en tu archivo `.env` local. Nunca se envia al repositorio.

---

## Estructura del proyecto

```
claude_apikey_chat/
├── backend/
│   ├── server.js          <- API Express (SSE streaming, Anthropic SDK)
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── web/               <- SPA — HTML/JS vanilla, PWA-ready
│   │   ├── index.html
│   │   ├── config.js      <- Editar URL del backend aqui
│   │   ├── manifest.json
│   │   └── sw.js          <- Service Worker para PWA
│   ├── mobile/            <- Capacitor (genera APK)
│   │   ├── capacitor.config.json
│   │   └── README_MOBILE.md
│   └── flutter/           <- App Flutter (web + Android + iOS)
│       ├── lib/
│       │   ├── main.dart
│       │   ├── chat_screen.dart
│       │   ├── api_service.dart
│       │   └── config.dart
│       └── pubspec.yaml
├── docker-compose.yml     <- Solo backend (frontend servido por separado)
├── .env.example           <- Referencia de variables de entorno
└── README.md
```

---

## Requisitos

- **Node.js** 18+
- **ANTHROPIC_API_KEY** — obtener en [console.anthropic.com](https://console.anthropic.com/)

Para Docker:
- **Docker Desktop** 4.x+

Para Flutter:
- **Flutter SDK** 3.x+ con `flutter doctor` sin errores criticos

---

## Instalacion y modos de uso

### Modo 1 — Directo con Node (mas simple)

```bash
cp .env.example .env
# Editar .env y agregar tu ANTHROPIC_API_KEY

cd backend
npm install
node server.js
```

Abri `frontend/web/index.html` en el navegador. El `config.js` ya apunta a `http://localhost:3200` por defecto.

### Modo 2 — Docker

```bash
cp .env.example .env
# Editar .env y agregar tu ANTHROPIC_API_KEY

docker-compose up --build
```

El backend queda disponible en `http://localhost:3200`.

Servir el frontend web por separado (cualquier servidor estatico):

```bash
# con npx
npx serve frontend/web -l 8080

# con Python
python -m http.server 8080 --directory frontend/web
```

### Modo 3 — Flutter web

```bash
cd frontend/flutter
flutter pub get
flutter run -d chrome --dart-define=API_URL=http://localhost:3200
```

O compilar para produccion:

```bash
flutter build web --dart-define=API_URL=http://localhost:3200
# output en: frontend/flutter/build/web/
```

### Modo 4 — PWA (instalar en movil desde Chrome)

1. Servir el frontend: `npx serve frontend/web -l 8080`
2. Abri `http://TU_IP:8080` en Chrome mobile
3. Menu -> "Agregar a pantalla de inicio"
4. Se instala como app nativa sin necesidad de Store

### Modo 5 — APK con Capacitor

Ver `frontend/mobile/README_MOBILE.md` para instrucciones completas.

---

## Frontends disponibles

| Frontend | Descripcion | Como correr |
|----------|-------------|-------------|
| `frontend/web/` | SPA HTML/JS, dark theme, PWA | Abrir `index.html` o servir con nginx |
| `frontend/flutter/` | App Flutter (web/Android/iOS) | `flutter run -d chrome` |
| `frontend/mobile/` | Wrapper Capacitor para APK | Ver `README_MOBILE.md` |

Todos consumen el mismo backend en `localhost:3200`. Para cambiar la URL edita:

- **Web:** `frontend/web/config.js`
  ```js
  window.CLAUDE_API_URL = 'http://192.168.1.100:3200';
  ```
- **Flutter:** `frontend/flutter/lib/config.dart` o pasar `--dart-define=API_URL=...` al compilar

---

## Variables de entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | *(requerida)* | Tu API key de Anthropic |
| `PORT` | `3200` | Puerto del servidor Express |
| `ALLOWED_ORIGINS` | `*` | Origenes CORS permitidos (ver seccion seguridad) |

Referencia completa en `.env.example`.

---

## Modelos disponibles

| ID | Descripcion |
|----|-------------|
| `claude-haiku-4-5-20251001` | Rapido y liviano |
| `claude-sonnet-4-6` | Equilibrio velocidad/capacidad |
| `claude-opus-4-6` | Maxima capacidad |

El modelo se puede cambiar desde la interfaz sin reiniciar el servidor.

---

## Seguridad — Leer antes de usar

Este proyecto fue disenado para **uso personal en red local**. Tiene decisiones de diseno que priorizan la simplicidad sobre la seguridad.

---

### Riesgo 1 — API Key expuesta (CRITICO)

Tu `ANTHROPIC_API_KEY` tiene acceso completo a la API de Anthropic. Si alguien la obtiene, puede generar costos ilimitados en tu cuenta.

**Mitigacion:**
- NUNCA commitear `.env` al repositorio
- NUNCA exponer la API key en el frontend o en logs publicos
- Rotar la key si sospechas que fue comprometida
- Usar restricciones de IP en console.anthropic.com si esta disponible

---

### Riesgo 2 — CORS abierto a `*`

El servidor responde a requests de **cualquier origen** por defecto (`ALLOWED_ORIGINS=*`).

**Consecuencia:** Una pagina web maliciosa abierta en tu navegador puede hacer llamadas silenciosas a `localhost:3200` y usar tu API key.

**Mitigacion:** Restringir los origenes al valor exacto que uses:

```yaml
# docker-compose.yml
environment:
  - ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3200
```

```bash
# Sin Docker
ALLOWED_ORIGINS=http://localhost:8080 node server.js
```

---

### Riesgo 3 — Sin autenticacion en los endpoints

Los endpoints (`/api/chat`, `/api/status`) no requieren ninguna credencial.

**Mitigacion recomendada:** Agregar autenticacion al backend si lo vas a exponer fuera de `localhost`:

```js
// En backend/server.js — agregar antes de las rutas /api
const API_TOKEN = process.env.API_TOKEN;
if (API_TOKEN) {
  app.use('/api', (req, res, next) => {
    if (req.headers.authorization !== `Bearer ${API_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}
```

---

### Resumen de mitigaciones

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| API key expuesta | Critico | No commitear .env, rotar si comprometida |
| CORS `*` | Alto | Restringir a origenes especificos en `ALLOWED_ORIGINS` |
| Sin autenticacion | Alto | Bearer token en endpoints |

---

## Advertencias al subir a GitHub

**El repositorio NO contiene credenciales.** Antes de hacer `git push` verifica:

```bash
# Buscar posibles secrets en el historial completo
git log -p | grep -i "sk-ant\|api_key\|password\|secret"

# Verificar que .env no esta trackeado
git ls-files .env

# El .gitignore ya cubre:
# .env, node_modules/, build/
```

Lo que **si se publica** al subir el repo:

- El codigo fuente del backend y frontends
- La configuracion de Docker
- Las instrucciones de uso

Lo que **nunca se publica** porque vive solo en tu maquina:

- `.env` con tu `ANTHROPIC_API_KEY`

**Si publicas el repo como publico:** Inclui un aviso claro de que es para uso personal/local y que exponer el puerto 3200 a internet sin autenticacion representa un riesgo real.

---

## Licencia

MIT — Uso personal. Sin garantias de seguridad para entornos de produccion.
