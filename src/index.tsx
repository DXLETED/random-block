import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { ipcRenderer } from 'electron'
import { useStateRef } from 'hooks/stateRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

import st from 'styles/index.sass'

const App: React.FC = () => {
  const [isEnabled, setIsEnabled, isEnabledRef] = useStateRef<boolean>(true)
  const [keys, setKeys, keysRef] = useStateRef<number[]>([])
  const [keyPick, setKeyPick, keyPickRef] = useStateRef(false)
  useEffect(() => {
    ipcRenderer.on('click', () => {
      if (!isEnabledRef.current) return
      const key = String.fromCharCode(keysRef.current[Math.floor(Math.random() * keysRef.current.length)])
      keysRef.current.length && ipcRenderer.send('presskey', key)
      console.log(key)
    })
    ipcRenderer.on('keyup', (_, e) => e.ctrlKey && e.altKey && e.rawcode === 82 && setIsEnabled((prev: boolean) => !prev))
    document.addEventListener('keyup', e => {
      if (e.keyCode >= 48 && e.keyCode <= 90 && keyPickRef.current) {
        setKeys([...keysRef.current, e.keyCode])
        setKeyPick(false)
      }
    })
  }, [])
  return <>
    <div className={st.bg} />
    <div className={st.title}>
      <div className={st.appName}>RANDOM BLOCK</div>
      <div className={st.ctrl}>
        <div onClick={() => ipcRenderer.send('minimize')}><FontAwesomeIcon icon={faCaretDown} size="lg" /></div>
        <div onClick={() => window.close()}><FontAwesomeIcon icon={faTimes} size="lg" /></div>
      </div>
    </div>
    <div className={st.keys}>
      {keys.map((k, i) => <div className={st.button} onClick={() => setKeys(keys.filter((_, ii) => ii !== i))} key={i}>{String.fromCharCode(k).toUpperCase()}</div>)}
      <div className={clsx(st.button, st.add, { [st.enabled]: keyPick })} onClick={() => setKeyPick(!keyPick)}>
        {keyPick ? <>Нажмите клавишу</> : <><FontAwesomeIcon className={st.icon} icon={faPlus} size="sm" /> Добавить клавишу</>}
      </div>
    </div>
    <div className={st.settings}>
      <div className={st.state}>
        <div className={clsx(st.button, st.switch)} onClick={() => setIsEnabled(!isEnabled)}>
          {isEnabled ? <><div className={st.check}><FontAwesomeIcon className={st.icon} icon={faCheck} /></div>Включено</> : <><div className={st.check} />Отключено</>}
        </div>
        <div className={st.tip}>Ctrl + Alt + R</div>
      </div>
    </div>
  </>
}

ReactDOM.render(<App />, document.getElementsByTagName('root')[0])