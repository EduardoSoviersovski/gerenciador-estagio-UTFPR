# Holidays Manager (Curitiba & Paraná)
Este projeto contém um script em Python (`holiday_formatter.py`) desenvolvido para processar e filtrar dados de feriados obtidos através da API feriados.dev.

O objetivo principal do formatador é extrair de uma lista geral apenas os feriados que são relevantes para a região, especificamente:

- Feriados Nacionais (Brasil)
- Feriados Estaduais (Paraná - PR)
- Feriados Municipais (Curitiba)

📁 Estrutura do Projeto
O projeto possui a seguinte estrutura de arquivos:

```plaintext
holidays_manager/
├── holiday_formatter.py       # Script principal de filtragem e formatação
├── holidays_from_2026.json    # Arquivo de dados brutos obtido da API
└── README.md                  # Este arquivo de documentação
```

🚀 Como Usar
1. Obter os Dados da API
Primeiro, você precisa baixar os dados brutos dos feriados do ano desejado (neste exemplo, 2026) da API do feriados.dev. Você precisará de uma chave de API válida.

Execute o seguinte comando no seu terminal, substituindo SUA_API_KEY pela sua chave real, e salve o resultado no arquivo .json:

```bash
curl -H "X-API-Key: SUA_API_KEY" "https://api.feriados.dev/v1/holidays/year/2026" > holidays_from_2026.json
```

2. Executar o Formatador
Certifique-se de ter o Python instalado em sua máquina. Com o arquivo `holidays_from_2026.json` salvo no mesmo diretório do script, execute o formatador:

```Bash
python holiday_formatter.py
```

3. Saída Esperada
O script irá ler o arquivo JSON, aplicar os filtros condicionais (identificando type: "national", stateCode: "PR" e code: "PR-curitiba") e poderá gerar a lista limpa ou um comando INSERT SQL pronto para popular o seu banco de dados, dependendo de como você configurou a saída no .py.
