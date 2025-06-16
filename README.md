# Gestor de Consumibles y Accesorios Snipe-IT

Esta aplicación web permite gestionar consumibles y accesorios en tu instancia de Snipe-IT. Proporciona una interfaz simple y eficiente para:

- Ver un dashboard con estadísticas de stock
- Gestionar consumibles (agregar, editar, eliminar)
- Gestionar accesorios (agregar, editar, eliminar)
- Monitorear niveles de stock

## Requisitos

- Node.js 14 o superior
- npm 6 o superior
- Una instancia de Snipe-IT con API habilitada

## Instalación

1. Clona este repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
SNIPE_API_URL=http://tu-instancia-snipe-it.com/api/v1
SNIPE_API_TOKEN=tu-token-de-api
```

4. Inicia el servidor de desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:1234`

## Uso

1. **Dashboard**: Muestra un resumen de los consumibles y accesorios, incluyendo totales y alertas de stock bajo.

2. **Consumibles**: 
   - Ver lista de consumibles
   - Agregar nuevos consumibles
   - Editar consumibles existentes
   - Eliminar consumibles

3. **Accesorios**:
   - Ver lista de accesorios
   - Agregar nuevos accesorios
   - Editar accesorios existentes
   - Eliminar accesorios

## Desarrollo

Para construir la aplicación para producción:
```bash
npm run build
```

Los archivos de producción se generarán en el directorio `dist/`.

## Tecnologías utilizadas

- TypeScript
- Bootstrap 5
- Axios
- Parcel

## Licencia

MIT 