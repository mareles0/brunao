tarefas = []

while True:
    opcao = input("(1) Adicionar (2) Listar (3) Remover (4) Sair: ")

    if opcao == "1":
        tarefa = input("Nova tarefa: ")
        tarefas.append(tarefa)
    elif opcao == "2":
        for i, t in enumerate(tarefas, 1):
            print(f"{i}. {t}")
    elif opcao == "3":
        indice = int(input("Número da tarefa: ")) - 1
        if 0 <= indice < len(tarefas):
            tarefas.pop(indice)
    elif opcao == "4":
        break
