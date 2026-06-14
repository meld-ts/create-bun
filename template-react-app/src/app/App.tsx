import ReactSvg from '../assets/react.svg';

const App = () => {
  return (
    <div
      style={{
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <img src={ReactSvg} alt={'React Logo'} style={{ width: 128 }} />
        <span>Ｘ</span>
        <img
          src={'https://bun.com/logo.svg'}
          alt={'Bun Logo'}
          style={{ width: 128 }}
        />
      </div>
      <h1>Web App @ React + Bun</h1>
      <p style={{ color: 'rgb(from currentColor r g b / 0.6)' }}>Have fun!</p>
    </div>
  );
};

export default App;
