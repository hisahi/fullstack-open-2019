import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({name}) => (
  <h2>{name}</h2>
)

const Part = ({part, exercises}) => (
  <p>
    {part} {exercises}
  </p>
)

const Content = ({parts}) => {
  return <div>{parts.map((part, index) => 
          <Part key={index} part={part.name} exercises={part.exercises} />)
        }</div>;
}

const Total = ({parts}) => (
  <b>total of {
    parts.reduce((x, y) => x + y.exercises, 
    0)} exercises</b>
)

const Course = ({course}) =>  (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
