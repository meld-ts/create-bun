import { createFileRoute } from '@tanstack/react-router';
import ReactSvg from '../assets/react.svg';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="wrapper">
      <div className="have-fun">
        <img src={ReactSvg} alt={'React Logo'} />
        <span>Ｘ</span>
        <img src={'https://bun.com/logo.svg'} alt={'Bun Logo'} />
        <span>Ｘ</span>
        <img
          src={'https://tanstack.com/images/logos/logo-color-600.png'}
          alt={'Tanstack Logo'}
        />
      </div>
      <h1>Web App @ React + Bun + Tanstack/Router</h1>
      <p className="secondary-text">Have fun!</p>
    </div>
  );
}
