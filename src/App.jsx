import { useState, useEffect } from 'react'

const App = () => {

  const [ value, setValue] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)
  const [loading, setLoading] = useState(false);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(message)

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if ( currentTitle && value && message) {
      setPreviousChats(previousChats => (
        [...previousChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      getMessages();
      e.target.classList.add("input-shake");
      setTimeout(() => {
        e.target.classList.remove("input-shake");
      }, 500);
    }
  };

  return (
    <>
      <div className="app">
        <section className="side-bar">
          <button onClick={createNewChat}>New Chat</button>
          <ul className="history">
            {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
          </ul>
          <nav>
            <p>FijiPT</p>
          </nav>
        </section>
        <section className="main">
          {!currentTitle && <h1>Fiji-PT</h1>}
          <ul className="feed">
          {currentChat?.map((chatMessage, index) =>
          <li
            key={index}
            className={`cloud ${chatMessage.role === 'assistant' ? 'right' : 'left'}`}
          >
            <p className='role' >{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
            {chatMessage.role === 'assistant' && <img className='gif' src="/giphy.gif" alt="giphy" />}
          </li>
          )}
          </ul>
          <div className="botton-section">
            <div className="input-container">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyUp={handleKeyUp}
                className="input"
              />
              <div id="submit" onClick={getMessages}>
                ➢
              </div>
              <p className="info">Fiji knows the answer.</p>
            </div>
          </div>
        </section>
        </div>
    </>
  )
}

export default App