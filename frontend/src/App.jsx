function App() {

  function divide(a, b) {
    if (b === 0) {
      return 'Error';
    }
    return a / b;
  }

  return (
    <div>
      <h1>Coverage Demo</h1>
      <button onClick={() => divide(10, 2)}>
        Click Me
      </button>
    </div>
  )
}

export default App
