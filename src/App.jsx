import { debounce, isEmpty } from 'lodash'
import React, { useCallback, useEffect } from 'react'

const App = () => {
  const [url, setUrl] = React.useState('')
  const [fecthResult, setFetchResult] = React.useState('')

  

  const navigateUrl = () => {
    window.open(url, '_blank')
  }

  const onChangeUrl = (e) => {
    setUrl(e.target.value)
    splitUrlIntoObject(e.target.value)
  }

  useEffect(() => {
    if (isEmpty(url)) {
      setFetchResult('')
    }
  }, [url])
  

/**
 * Splits a URL into an object based on the query parameters.
 *
 * @param {string} url - The URL to split into an object.
 * @return {Object} An object containing the URL and the query parameters as key-value pairs.
 */
const splitUrlIntoObject = useCallback(debounce((url) => {
  try {
    const urlObject = new URL(url);
    const params = Object.fromEntries(urlObject.searchParams.entries());
    const result =  JSON.stringify({
      url: urlObject.origin + urlObject.pathname,
      ...params,
    }, null, 2)

    setFetchResult(result)
  } catch (error) {
    setFetchResult('')
  }
}, 100), []);

const RenderFetchResult = () => {
  try {
    const result = JSON.parse(fecthResult)
    return (
      <table className="table-fixed m-10 bg-white">
        <thead className="bg-red-500 h-10 max-h-20">
          <tr>
            <th className='text-white'>Params</th>
            <th className='text-white'>Values</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(result).map((key, index) => {
          return (
            <tr key={index} className='border border-white h-10'>
              <td className='px-5 bg-gray-200'>{key}</td>
              <td className='px-5 bg-gray-100'>{result[key]}</td>
            </tr>
          )
          })}
        </tbody>
      </table>
    )
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className='flex flex-col md:min-h-screen md:min-w-full bg-gradient-to-r from-blue-500 to-white p-10'>
      <label className='self-center font-sans font-light text-2xl md:text-4xl text-gray-300'>Navigate Tester</label>
        <input
          value={url}
          onChange={onChangeUrl}
          className='mt-20 mx-40 h-10 p-2 bg-white border rounded-md text-gray-600'
          placeholder='Link'
        />
      <button
          onClick={navigateUrl}
          className='mt-10 font-sans font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-60 self-center'
        >{'Navigate'}</button>
      <RenderFetchResult />
      <label className='mt-10 text-white font-mono underline text-sm font-light self-center'>© 2024</label>
    </div>
  )
}

export default App