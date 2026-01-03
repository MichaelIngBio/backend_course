const express = require('express') //Importamos express
const app = express() //creamos una aplicación express que se guarda en la variable app
const cors = require('cors')

app.use(cors())

let notes =[
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only javascript",
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('-------')
    next()
}
app.use(express.json()) //activación de json-parser
app.use(requestLogger)

/*Se define un controlador de eventos, que se utiliza para manejar las solicitudes HTTP GET realizadas a la raíz '/'
de la aplicación. La función del controlador de eventos acepta dos parámetros. El perimer parámetro 'request'
contiene toda la información de la solicitud HTTP y el segundo parámetro 'response' se utiliza para definir
cómo se responde a la solicitud.

En nuestro código, la solicitud se responde utilizando el método 'send' del objeto 'response'. Llamar al método
hace queel servidor responda a la solicitud HTTP enviando una respuesta que contiene el string <h1>Hello Wordl </h1>,
que se pasó al método 'send'. Dado que el parámetro es un string, Express establece automáticamente el valor de 
cabecera Content-Type en text/html. El código de estado de la respsuesta predeterminado es 200.

Se puede verificar lo anterior desde la pestaña Network en las herramientas para desarrolladores
*/
app.get('/', (request, response) =>{
    response.send('<h1>Hello World!</h1>')
})


/*
Se define un controlador de eventos, que maneja las solicitudes HTTP GET realizadas a la ruta notes de la aplicación
La solicityd se responed con el método 'json' del objeto 'response'. Llamar al método enviará el array notes
que se le pasó como un string con formato JSON (con Express la transformación se hace de forma automatica).
Express establece automáticamente la cabecera Conten-Type con el valor apropiado de application/json. 
*/
app.get('/api/notes', (request, response) => {
    response.json(notes)
})

/*
Ahora app.get('/api/notes/:id',...) manejará todas las solicitudes HTTP GET, que tienen el formato
/api/notes/SOMETHING, donde SOMETHING es una cadena arbitrari.
*/
app.get('/api/notes/:id', (request, response) =>{
    //La siguiente linea se usa para acceder al parámetro id en la ruta de una solicitud a través del objeto 'request'
    const id = Number(request.params.id) //Se tiene que pasar el parámetro a number ya que el '===' debe ser igual en valor y tipo
    //el método 'find' se utiliza para encontrar la nota con un id que coincida con el parámetro
    const note = notes.find(note => note.id === id)
    if(note){ //los objetos en Javascript son truthy (se evaluan como verdadero).
    //La nota se devuelve al remitente de la solicitud
    response.json(note)
    }else{//undefined es falsy (se evaluara como falso)
        response.status(404).end()
    }
})
/*
Nuestra aplicación funciona y envía el código de estado de error si no se encuentra ninguna nota. Sin embargo, la
aplicación no devuelve nada para mostrar al usuario, como suelen hacer las aplicaciones web cuando visitamos una
página que no existe. EEn realidad, no necesitamos mostrar nada en el navegador porque las API REST sosn interfaces
diseñadas para uso programático, y el código de estado de error es todo lo que necesitamos.
*/

//Eliminar recursos: Implementamos una ruta para eliminar recursos. La eliminación ocurrea al realiazar una solicitud
//HTTP DELETE a la URL del recurso:

app.delete('/api/notes/:id', (request, response) =>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end
})
/*
Si la eliminación del recurso es exitosa, lo que significa que la nota existe y se elimina, respondemos a la solicitud
con el código de estamo 204 no content y no devolvemos datos como respuesta. No hay consenso sobre qué código de
estado debe devolverse a una solicitud DELETE si el recurso no existe. Realmente, las únicas dos opciones son 204 y
404. En aras de la simplicidad, nuestra aplicación responderá con 204 en ambos casos
*/


/*
sin json-parser, la propiedad body no estaría definida. El json-parser funciona paa que tome los datos JSON de
una solicityd, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto 'request'
antes de llamar al controlador de ruta.
*/

/*
notes.map(n => n.id) crea un nuevo array que contiene todos los ids de las notas. Math.max devuelve el valor
máximo de los números que se le pasan. Sin embargo, notes.map(n => n.id) es un array, por lo que no se puede asignar
directamente como parámetro a Math.max. El array se puede transformar en número individualess mediante el uso de la
sintaxis spread(tres puntos)
*/
const generateId = () =>{
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}
app.post('/api/notes', (request, response) =>{
    const body = request.body
    /*
    a veces cuando se esta depurando, es posible que desees averiguar qué cabeceras se han configurado en 
    la solicitud HTTP. Una forma de lograrlo es mediante el método get del objeto request, que se puede usar
    para objeter el valor de una sola cabecera. El objeto reques también tiene la propiedad headers, que 
    contiene todas las cabeceras de una solicitud específica.
    */
    console.log(request.get('Content-Type'))
    console.log(request.headers)
    //Si a los datos recibidos les falta un valor para la propiedad content, el servidor responderá a la solicitud
    //con el codigo de estado 400 bad request
    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    //Si falta la propiedad important entonces el predeterminado será false
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false,
    }

    notes = notes.concat(note)
    response.json(note)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001   
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})