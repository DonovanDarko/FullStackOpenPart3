export const AddPersonForm = (props) => {
    return (
      <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value = {props.newNumber} onChange={props.handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
}
  
export const Filter = (props) => {
    return (
        <div>filter shown with: <input value={props.filter} onChange={props.handleFilterChange}/></div>
    )
}

export const Person = ({ person, deletePerson }) => {
    return (
        <li>{person.name}  {person.number} <button onClick = {deletePerson}> delete? </button> </li>
    )
}

export const PersonList = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map(person => <Person key={person.name} person={person} deletePerson={() => deletePerson(person.id)} /> )}
    </ul>
  )
}