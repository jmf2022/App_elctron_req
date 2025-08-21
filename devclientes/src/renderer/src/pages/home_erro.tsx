import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch('https://jmfservicosecomericio.com.br/htmlphpbdcssboostrap/listar_prod.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        return response.json();
      })
      .then(data => {
        setProdutos(data);
        setCarregando(false);
      })
      .catch(error => {
        setErro(error.message);
        setCarregando(false);
      });
  }, []);

  return (
    <div>
      <h1>Página HOME!!!</h1>
      <h3>Produtos Cadastrados</h3>
      <Link to="/create">Ir para página create</Link>

      {carregando && <p>Carregando produtos...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {!carregando && !erro && produtos.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!carregando && !erro && produtos.length === 0 && <p>Nenhum produto encontrado.</p>}
    </div>
  );
}
