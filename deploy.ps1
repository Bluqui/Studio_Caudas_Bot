param (
    [switch]$y
)

function regSlash {
    node .\main\deploy-commands.js
    Write-Host "Registrando ShashCommands..."
}

function doPush{
    Write-Host "Adicionando todos os arquivos" -ForegroundColor Cyan
    git add ./
    Write-Host "`nFazendo Commit" -ForegroundColor Blue
    git commit -m "1.0.2"
    Write-Host "`nDando o Push" -ForegroundColor DarkBlue
    git push origin HEAD:four
}

function inicializar{
    Write-Host "Iniciando..."
    nodemon
}

if(!$y) {
    Write-Host "Registrar os ShashCommands?" -ForegroundColor Cyan
    do {
        $confirmSlashDeploy = Read-Host "[y] - [n]"
        if ($confirmSlashDeploy -eq 'Y') {
            regSlash
        } elseif ($confirmSlashDeploy -eq 'N'){
            Write-Host "Registro cancelado"
        } else {}
    } while ($confirmSlashDeploy -ne 'Y' -and $confirmSlashDeploy -ne 'N')

    doPush

    Write-Host "Iniciar?" -ForegroundColor Cyan
    do {
        $confirmIni = Read-Host "[y] - [n]"
        if ($confirmIni -eq 'Y') {
            inicializar
        } elseif ($confirmIni -eq 'N'){
            Write-Host "Inicializa��o cacelada"
        } else {}
    } while ($confirmIni -ne 'Y' -and $confirmIni -ne 'N')


} else {
    regSlash
    doPush
    inicializar
}