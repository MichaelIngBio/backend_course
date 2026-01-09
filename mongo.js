const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}
//Al ejecutar el comando node mongo.js **password** --> Toma el elemento en la posición 2 (password)
const password = process.argv[2]

//url para hacer la conexión con mongodb atlas.
const url = `mongodb+srv://Ingeniero_yo_forever:${password}@cluster0.h5q1ctf.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false) //Permite que las consultas incluyan campos que no están definidas en el schema

mongoose.connect(url)  //Establece la conexión usando la url anteriormente definida

/*Generamos el esquema de una nota que se almacena en la variable 'noteSchema'. El esquema le dice a Mongoose
cómo se almacenarán los objetos de nota en la base de datos*/
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
/*Definimos el modelo Note, donde el primer parámetro 'Note' es el nombre singular del modelo. El nombre de la
colección será el plural 'notes' en minúsculas, porque la convención ded Monggose es nombrar automáticamente las
colecciones como el plural (por ejemplo, notes) cuando el esquema se refiere a ellas en singular (por ejemplo, Note)
 */
const Note = mongoose.model('Note', noteSchema)
/*Las bases de datos de documentos como MongoDB no tienen esquema, lo que significa que la base de datos en sí no
se preocupa por la estructura de los datos que se almacenan en la base de datos. Es posible almacenar documentos
con campos completamente diferentes en la misma colección.

La idea detras de Mongoose es que los datos almacenados en la base de datos reciben un esquema al nivel de la
aplicación que define la forma de los documentos almacenados en una colección determinada
 */

/*A continuación, la aplicación crea un nuevo objeto de nota con la ayuda del modelo 'Note'. 
Los modelos son funciones constructoras que crean nuevos objetos JavaScript basados en los parámetros
proporcionados. Dado que los objetos se crean con la función constructora del moddelo, tiene todas las
propiedades del modelo, que incluyen métodos para guardar el objeto en la base de ddatos. */
const note = new Note({
    content: 'HTML is Easy',
    important: true
})

/*Guardar el objeto en la base de datos ocurre con el método 'save', que se puedde proporcionar con un controlador
de eventos con el método 'then'
*/

/*
note.save().then(result =>{
    console.log('note saved!')
    mongoose.connection.close()
})
*/


/*Cuando el objeto se guarda en la base de datos, el controlador de eventos proporcionado a 'then' se invoca.
El controlador de eventos cierra la conexión de la base de datos con el comando mongoose.connection.close(). Si
la conexión no se cierra, el programa nunca terminará su ejecución.
 */

/*El siguiente código muestra por pantalla todass lass notas almacenadas en la base de datos. Los objetos se
recuperan con el método 'find' del modelo Note. El parámetro del método es un objeto que expresa conddiciones 
de búsqueda. Dado que el parámetro es un objeto vacío {}, obtenemos todas las notas almacenadas en la colección
notes
 */
/*
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
*/

//Se puede restrigir la búsqueda para incluir solo notas importantes de la siguiente manera:

Note.find({important: true}).then(result =>{
    result.forEach(note =>{
        console.log(note)
    })
    mongoose.connection.close()
})