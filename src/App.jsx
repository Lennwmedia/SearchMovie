import { Movies } from './components/Movies' 
import { useMovies } from './hooks/useMovies'
import './App.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch () {
  const [ search, setSearch ] = useState('')
  const [ error, setError ] = useState(null)
  const isFirstInput = useRef(true)
  
  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    
    if (search === ''){
      setError('No se puede buscar una pelicula con el input vacio')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('Caracter invalido')
      return
    }

    if (search.length < 3) {
      setError('El nombre debe de tener al menos 3 caracteres')
      return
    }

    setError(null)

  }, [search])

  return { search, setSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const { search, setSearch, error} = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debounceSetMovies = useCallback(
    debounce(search => {
    console.log('render') 
    getMovies({ search })
  }, 300)
  , []
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }
  
  const handleChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    debounceSetMovies(newSearch)
    
  }

  return (
    <div className='page'>
      <header>
        <h2>Buscador de Peliculas</h2>
        <form className='form' onSubmit={handleSubmit}>
        <input 
          style={{
            border: '1px solid transparent',
            borderColor: error ? 'red' : 'transparent'
          }}
          onChange={handleChange} 
          value={search} 
          name='query' 
          placeholder='Avengers: Age of Ultron, The A...'/>
        <input type="checkbox" onChange={handleSort} checked={sort}/>
        <button  type='submit'>Buscar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      
      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
        
      </main>
    </div>


  )
}

export default App
