const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

morgan.token('person', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '--',
      tokens['response-time'](req, res), 'ms',
      tokens.person(req,res)
    ].join(' ')
  }))

let persons = [
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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
    current_time = new Date()
    response.send(`<div>Phonebook has info for ${persons.length} people </div> <br /> <div>${current_time}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random()*100000000).toString()
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === "" || body.number === "" ) {
        response.status(400).json({
            error: 'name or number is not provided'
        })
    }

    let existingPerson = persons.find((person) => person.name === body.name)

    if(existingPerson) {
        response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})