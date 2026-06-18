import ReactSvg from '../assets/react.svg';

const App = () => {
  return (
    <div className="wrapper">
      <div className="have-fun">
        <img src={ReactSvg} alt={'React Logo'} />
        <span>Ｘ</span>
        <img src={'https://bun.com/logo.svg'} alt={'Bun Logo'} />
      </div>
      <h1>Web App @ React + Bun</h1>
      <p className="secondary-text">Have fun!</p>
    </div>
  );
};

export default App;
