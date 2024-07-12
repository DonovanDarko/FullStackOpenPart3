import { useState, useEffect } from 'react'
import personService from './services/person'
import { AddPersonForm, Filter, PersonList } from './components/PersonComponents'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsToShow, setPersonsToShow] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({'message': null, 'error': false})

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
        setPersonsToShow(persons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    let existingPerson = persons.find((person) => person.name === personObject.name)

    if (existingPerson) {
      if (confirm(`\'${newName}\' is already added to phonebook. Replace the old number with a new one?`)) {
        personService
        .update(existingPerson.id, personObject)
        .then(returnedPerson => {
          let personList = persons.filter(person => person.id !== existingPerson.id).concat(returnedPerson)
          setPersons(personList)
          setFilter('')
          setPersonsToShow(personList.filter(p => true))
          setNewName('')
          setNewNumber('')
          setNotification(
            {
              'message': `Number Updated for '${personObject.name}'`,
              'error': false
            }
          )
          setTimeout(() => {
            setNotification({'message':null,'error':false})
          }, 5000)
        })
        .catch(error => {
          setNotification(
            {
              'message': `This person was already deleted`,
              'error': true
            }
          )
          setTimeout(() => {
            setNotification({'message':null,'error':false})
          }, 5000)
        })
      }
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setFilter('')
        setPersonsToShow(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotification(
          {
            'message': `Added '${personObject.name}'`,
            'error': false
          }
        )
        setTimeout(() => {
          setNotification({'message': null, 'error': false})
        }, 5000)
      })
    }
  }

  const deletePersonRecord = (id) => {
    if (window.confirm(`Do you really want to delete \`${persons.find(person => person.id === id).name}\`?`)) {
      personService
      .destroy(id)
      .then(removedPerson => {
        let remainingPersons = persons.filter(n => n.id != id)
        setPersons(remainingPersons)
        setPersonsToShow(
          remainingPersons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        )
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setPersonsToShow(
      persons.filter((person) => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} error = {notification.error} />
      <AddPersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonList persons={personsToShow} deletePerson={deletePersonRecord} />
    </div>
  )
}

export default App