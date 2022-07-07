# Dependencias

- **dependencies**
    - **express:** Framework de NodeJS que facilita el código en el servidor
    - **morgan:** Es un middleware que permite visualizar en consola las peticiones HTTP
- **devDependencies:**
    - **nodemon:** 





# src/index.js

Es el archivo principal del servidor




## Settings

Con `app.set('nombre', valor)` definimos constantes que pueden ser accedidadas desde todo el servidor

```javascript
//* Settings
app.set('port', process.env.PORT || 3000)                                  // 1.
app.set('json spaces', 2)                                                  // 2.
```
1. Algunos servicios, como Heroku, definen sus propios puertos. Con `process.env.PORT` usamos ese puerto en caso de estar definido y si no, usamos el puerto 3000 por defecto. Además podemos definir un puerto diferente desde la terminal haciendo `PORT=XXXX npm start`.
2. Formatea las respuestas envíadas con JSON agregandole espaciados 




## Middlewares

Un **middleware** es una función que procesa datos antes de que el servidor los reciba.

```javascript
//* Middlewares
app.use(morgan('dev'))                                                     // 1.
app.use(express.urlencoded({ extended: false }))                           // 2.
app.use(express.json())                                                    // 3.
```
1. Utiliza el middleware de morgan configurado como *dev*.
2. Permite al servidor recibir información de los formularios. Usamos `{ extended: false }` ya que solo vamos a trabajar con datos de texto, no vamos a recibir imágenes u otros tipos de archivos.
3. Permite al servidor recibir formatos JSON y entenderlos.



## Routes
```javascript
//* Routes
app.use(require('./routes/index'))                                         // 1.
app.use('/api/movies', require('./routes/movies'))                         // 2.
```
1. ...
2. Todas las rutas que vienen desde /api/movies son manejadas en ./routes/movies





# src/routes/index.js

En lugar de manejar todas las rutas desde el archivo src/index.js, las manejamos desde un archivo separado.

Para poder exportar las rutas, y así poder usarlas desde otro archivo (src/index.js), tenemos que usar `express.Router`, que permite definir nuevas rutas para el servidor

