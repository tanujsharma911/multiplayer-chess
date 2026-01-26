import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiShadcnui } from 'react-icons/si';
import { IoLogoNodejs } from 'react-icons/io';

const Docs = () => {
  return (
    <div className="p-10 text-left space-y-32 leading-10 text-2xl font-medium text-zinc-400">
      <section className="space-y-8">
        <h1 className="scroll-m-20 text-center text-5xl text-white font-extrabold tracking-tight text-balance">
          Documentation
        </h1>

        <div className="space-x-2">
          <img
            src="https://img.shields.io/badge/hostinger-%23673DE6.svg?style=for-the-badge&logo=hostinger&logoColor=white"
            alt="Hostinger Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"
            alt="Ubuntu Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"
            alt="Docker Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"
            alt="Docker Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
            alt="React JS logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"
            alt="MongoDB logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"
            alt="Express Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"
            alt="Node.js Logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"
            alt="Node package manager logo"
            className="inline-block"
          />
          <img
            src="https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white"
            alt="ShadCN UI Logo"
            className="inline-block"
          />
        </div>

        <p className="">
          ChessKhelo is an{' '}
          <strong className="text-zinc-200">online chess platform</strong>{' '}
          designed to deliver a smooth and engaging multiplayer chess
          experience. It allows users to play chess in multiple modes, including{' '}
          <strong className="text-zinc-200">
            player vs player, player vs bot 🤖
          </strong>{' '}
          making it suitable for both casual players. The platform focuses on
          real-time gameplay, fair matchmaking, and an intuitive UI, ensuring
          seamless moves, instant updates, and minimal latency during matches.
          ChessKhelo also emphasizes scalability and performance, making it
          capable of handling multiple concurrent games efficiently. Overall,
          ChessKhelo aims to combine classic chess mechanics with modern web
          technologies to create a fast, reliable, and enjoyable online chess
          ecosystem
        </p>
      </section>
      <section className="space-y-8">
        <h2 className="scroll-m-20 text-3xl text-zinc-100 font-semibold tracking-tight">
          System Design
        </h2>
        <p>Let's break it down into several components:</p>
        <ol className="list-decimal pl-6">
          <li>
            <strong className="text-zinc-200">High-Level Architecture</strong>
          </li>
          <li>
            <strong className="text-zinc-200">Frontend</strong>
          </li>
          <li>
            <strong className="text-zinc-200">Backend</strong>
          </li>
          <li>
            <strong className="text-zinc-200">Database</strong>
          </li>
          <li>
            <strong className="text-zinc-200">WebSocket</strong>
          </li>
        </ol>
      </section>
      <section className="space-y-8">
        <h2 className="scroll-m-20 text-3xl text-zinc-100 font-semibold tracking-tight">
          High-Level Architecture
        </h2>
        <p>ChessKhelo follows a client–server, real-time architecture:</p>
        <img
          src="/img/Architecture_dark.png"
          alt="High-Level Architecture"
          className="max-h-[70vh]"
          loading="lazy"
        />
      </section>

      {/* Front End */}
      <section className="space-y-8">
        <h2 className="scroll-m-20 text-3xl text-zinc-100 font-semibold tracking-tight">
          Frontend
        </h2>
        <p>
          The frontend is built using
          <strong className="text-zinc-200">
            <FaReact className="inline-block text-sky-400 mx-2 motion-preset-spin motion-duration-8000" />{' '}
            React
          </strong>
          {', '}
          <strong className="text-zinc-200">
            <SiTypescript
              className="inline-block text-sky-400 mx-2"
              size={20}
            />{' '}
            TypeScript
          </strong>{' '}
          and{' '}
          <strong className="text-zinc-200">
            <SiShadcnui className="inline-block text-zinc-200 mx-2" size={20} />{' '}
            ShadCN
          </strong>
          , providing a responsive and interactive user interface. It handles
          user input, displays game boards and uses{' '}
          <strong className="text-zinc-200">Chess.js</strong> for validation,
          and communicates with the backend via WebSocket. And uses{' '}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xl text-zinc-300 font-semibold">
            chess-api.com
          </code>{' '}
          for AI or <strong className="text-zinc-200">Stockfish</strong> moves.
        </p>
      </section>

      {/* Backend */}
      <section className="space-y-8">
        <h2 className="scroll-m-20 text-3xl text-zinc-100 font-semibold tracking-tight">
          Backend
        </h2>
        <p>
          The backend is built using{' '}
          <strong className="text-zinc-200">
            <IoLogoNodejs className="inline-block text-emerald-500" /> Node.js
          </strong>
          {', '}
          <strong className="text-zinc-200">
            <SiTypescript
              className="inline-block text-sky-400 mx-2"
              size={20}
            />{' '}
            TypeScript
          </strong>{' '}
          and{' '}
          <div className="inline-block space-x-2">
            {' '}
            <img
              src="/img/websocket.webp"
              alt="websocket.io logo"
              width={24}
              height={24}
              className="inline-block mb-1"
            />
            <strong className="text-zinc-200">WebSocket.io</strong>
          </div>
          . It handles game logic, user authentication using google OAuth2, and
          database interactions.
        </p>
        <img
          src="/img/backend.png"
          alt="High-Level Architecture"
          className="max-h-[70vh]"
          loading="lazy"
        />
        <p>
          GameManager acts as the central coordinator responsible for managing
          users, matchmaking, and active chess games. It maintains collections
          of users and games, handles socket events, and creates or terminates
          game sessions. Each Game instance represents a single chess match
          between exactly two Users, while GameManager ensures lifecycle
          management and message routing.
        </p>
        <img
          src="/img/uml.png"
          alt="UML diagram"
          className="max-h-[70vh]"
          loading="lazy"
        />
      </section>

      {/* Database */}
      <section className="space-y-8">
        <h2 className="scroll-m-20 text-3xl text-zinc-100 font-semibold tracking-tight">
          Database
        </h2>
        <p>
          The database is built using{' '}
          <strong className="text-zinc-200">
            <SiMongodb className="inline-block text-emerald-500" /> MongoDB
            Atlas
          </strong>
          , providing a scalable and reliable storage solution for user data,
          game history, and other relevant information.
        </p>
      </section>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
        <hr className="my-auto" />
        <span className="">End</span>
        <hr className="my-auto" />
      </div>
    </div>
  );
};

export default Docs;
