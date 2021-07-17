import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <a className="" href={`https://github.com/${props.githubUser}`}>
        @{props.githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.map(
          (itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={itemAtual.html_url} target="_blank" key={itemAtual}>
                  <img src={itemAtual.avatar_url} alt={itemAtual.login} title={itemAtual.login} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            )
          })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {

  const githubUser = 'brunogarvas';

  const [comunidades, setComunidades] = React.useState([{
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  const [seguidores, setSeguidores] = React.useState([]);
  const [influenciadores, setInfluenciadores] = React.useState([]);

  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      }).then(function (respostaCompleta) {
        console.log(respostaCompleta);
        setSeguidores(respostaCompleta);
      });

    fetch('https://api.github.com/users/brunogarvas/following')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      }).then(function (respostaCompleta) {
        console.log(respostaCompleta);
        setInfluenciadores(respostaCompleta);
      });

    fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: {
        'Authorization': '3e5477a6ed82d0f658e9f888d4cd1b',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            imageUrl
            title
            id
            creatorSlug
          }
        }`
      })
    }).then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesDatoCms = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesDatoCms);
        console.log(respostaCompleta)
      })

  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        {/* <Box style="grid-area:profileArea"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>

            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={
              function handleCriarComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);
                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                  creatorSlug: githubUser,
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                }).then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });

              }
            }>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map(
                (itemAtual) => {
                  return (
                    <li key={itemAtual.id}>
                      <a href={`/users/${itemAtual}`} key={itemAtual}>
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBox title="Influenciadores" items={influenciadores} />

          <ProfileRelationsBox title="Seguidores" items={seguidores} />

        </div>
      </MainGrid>
    </>
  );
}
