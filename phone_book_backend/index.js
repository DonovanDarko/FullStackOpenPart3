const express = require('express')
const app = express()

const Person = require('./models/person')

app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const cors = require('cors')
app.use(cors())
app.use(express.json())

const morgan = require('morgan')


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
    current_time = new Date()
    Person.find({}).then(persons => {
      response.send(`<div>Phonebook has info for ${persons.length} people </div> <br /> <div>${current_time}</div>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      response.json(result)
    })
  
/*
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

    result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      response.json(result)
    */
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, {
    number: request.body.number
  }, {
    new: true 
  })
  .then(result => {
    console.log(`updated ${result.name} with new number ${result.number}`)
    response.json(result)
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})