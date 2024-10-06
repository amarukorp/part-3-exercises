const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
morgan.token('data', (req,res)=>JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


const PORT = 3001

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = ()=>{
    const randomId= Math.floor(Math.random() * 1000);
    return randomId
}

app.get('/api/persons', (request,response)=>{
    
    response.json(phonebook)
})

app.get('/info', (request,response)=>{
    const requestDate = new Date()
    const PhonebookLenght = phonebook.length

    response.end(`<p>Phonebook has info for ${PhonebookLenght} people<p> <br> <p>${requestDate.toString()}`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const isPersonOnPhonebook = phonebook.find((person)=> person.id ===id)
    if(!isPersonOnPhonebook){
        response.status(404).end('<p>Resource not found<p>')
    }
    const selectedPerson = phonebook.filter((person)=>person.id===id)
    response.json(selectedPerson)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const isPersonOnPhonebook = phonebook.find(person=> person.id ===id)
    if(!isPersonOnPhonebook){
        response.status(404).end('<p>Resource not found<p>')}
    else{
        phonebook = phonebook.filter(person=>person.id!==id)
        response.status(204).end()
    }
})

app.post('/api/persons', (request,response)=>{
    const body = request.body
    console.log(body, 'here')
    const isNameDuplicated = phonebook.find(person=>person.name===body.name)
    
    if(!body.name || !body.number){
        return response.status(400).json({
            error:'The name or phone number are missing'
        })
    }
    if(isNameDuplicated){
        return response.status(400).json({
            error:'Name must be unique'
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    phonebook=phonebook.concat(newPerson)
    response.json(newPerson)
})

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))