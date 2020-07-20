const socket = io.connect('http://localhost:3000/');

const cancelSGV = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 507.2 507.2" style="enable-background:new 0 0 507.2 507.2; transform:scale(2.5);" xml:space="preserve" width="20px" heigth="20px">
<circle style="fill:#F15249;" cx="253.6" cy="253.6" r="253.6"/>
<path style="fill:#AD0E0E;" d="M147.2,368L284,504.8c115.2-13.6,206.4-104,220.8-219.2L367.2,148L147.2,368z"/>
<path style="fill:#FFFFFF;" d="M373.6,309.6c11.2,11.2,11.2,30.4,0,41.6l-22.4,22.4c-11.2,11.2-30.4,11.2-41.6,0l-176-176  c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L373.6,309.6z"/>
<path style="fill:#D6D6D6;" d="M280.8,216L216,280.8l93.6,92.8c11.2,11.2,30.4,11.2,41.6,0l23.2-23.2c11.2-11.2,11.2-30.4,0-41.6  L280.8,216z"/>
<path style="fill:#FFFFFF;" d="M309.6,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6L197.6,373.6  c-11.2,11.2-30.4,11.2-41.6,0l-22.4-22.4c-11.2-11.2-11.2-30.4,0-41.6L309.6,133.6z"/>
<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
</svg>`

const checkSVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 507.2 507.2" style="enable-background:new 0 0 507.2 507.2; transform:scale(2.5);" xml:space="preserve" width="20px" heigth="20px">
<circle style="fill:#32BA7C;" cx="253.6" cy="253.6" r="253.6"/>
<path style="fill:#0AA06E;" d="M188.8,368l130.4,130.4c108-28.8,188-127.2,188-244.8c0-2.4,0-4.8,0-7.2L404.8,152L188.8,368z"/>
<g>
	<path style="fill:#FFFFFF;" d="M260,310.4c11.2,11.2,11.2,30.4,0,41.6l-23.2,23.2c-11.2,11.2-30.4,11.2-41.6,0L93.6,272.8   c-11.2-11.2-11.2-30.4,0-41.6l23.2-23.2c11.2-11.2,30.4-11.2,41.6,0L260,310.4z"/>
	<path style="fill:#FFFFFF;" d="M348.8,133.6c11.2-11.2,30.4-11.2,41.6,0l23.2,23.2c11.2,11.2,11.2,30.4,0,41.6l-176,175.2   c-11.2,11.2-30.4,11.2-41.6,0l-23.2-23.2c-11.2-11.2-11.2-30.4,0-41.6L348.8,133.6z"/>
</g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
</svg>
`
var db = {}

const colorInput = document.querySelector('#colorBackground')
colorInput.addEventListener('input', () => {
    socket.emit('colorChange', colorInput.value)
})


socket.on('dbUpdate', (el) => {
    db = el
    document.body.style.background = db.backgroundColor
    colorInput.value = db.backgroundColor
    updateTarefas()
})


const tarefas = document.querySelector('#tarefas > tbody')
const updateTarefas = () => {
    tarefas.innerHTML = ''
    var counter = 0
    db.tarefas.forEach(({ tarefa , dia , prazo, done},index) => {
        tarefas.innerHTML += `
        <tr class="show" id="index${index}" ondblclick="deleteTarefa(${index},'${tarefa}')">
            <td onclick="openTarefa(${index})">${tarefa}</td>
            <td>${dia}</td>
            <td>${prazo}</td>
            <td onclick="checkUncheck(${index})" id="${done ? 'greenes' : 'redus'}">${done ? checkSVG : cancelSGV }</td>
        </tr>
        `
        if(done){
            counter++
        }
    }); 
    
    if(counter > 0){
        //verde        
        // document.querySelector('.container').style.background = `rgba(0,255,0,${counter / db.tarefas.length * 0.7 + 0.3})`       
    } else{
        //vermelho
        // document.querySelector('.container').style.background = `rgba(255,0,0,${Math.abs(counter) / db.tarefas.length * 0.7 + 0.3})`
    } 
    document.querySelector('#indicatorRed').style.width = `${Math.abs(db.tarefas.length - counter) / db.tarefas.length * 71.25}%`
    document.querySelector('#indicatorGreen').style.width = `${Math.abs(counter / db.tarefas.length) * 71.25}%`
}


const popup = document.querySelector('#popup-addTarefa')
const popup2 = document.querySelector('#popup-viewTarefa')
popup.addEventListener('click', event => {
    const classNameOfClickedElement = event.target.classList[0]
    const classNames = ['popup-close', 'popup-wrapper']
    const shouldClosePopup = classNames.some(className => className === classNameOfClickedElement)
    if (shouldClosePopup) {
        popup.style.display = 'none'
    }
})
popup2.addEventListener('click', event => {
    const classNameOfClickedElement = event.target.classList[0]
    const classNames = ['popup-close', 'popup-wrapper']
    const shouldClosePopup = classNames.some(className => className === classNameOfClickedElement)
    if (shouldClosePopup) {
        popup2.style.display = 'none'
    }
})
const tarefaTitle = document.querySelector('#tarefaTitleForm')
const tarefaDate = document.querySelector('#prazoForm')
const descricao = document.querySelector('#descricao')
tarefaDate.valueAsDate = new Date()
function popupAddClicked(){
    popup.style.display = 'block'
    tarefaTitle.focus()
    setTimeout(()=>{
        tarefaTitle.value = ''
    },50)
}

function putItRight(e) {
    let aux = []
    for (let index = e.length - 1; index >= 0; index--) {
        if (index == e.length - 1 || index == e.length - 2) {
            aux.push(e[index])
        } else if (index == e.length - 4 || index == e.length - 5) {
            aux.push(e[index])
        } else if (index == e.length - 3 || index == e.length - 6) {
            aux.push('/')
        } else {
            aux.push(e[index])
        }
    }
    let aux2 = aux[1]
    aux[1] = aux[0]
    aux[0] = aux2
    aux2 = aux[4]
    aux[4] = aux[3]
    aux[3] = aux2
    aux2 = aux[9]
    aux3 = aux[8]
    aux4 = aux[7]
    aux5 = aux[6]
    aux[6] = aux2
    aux[7] = aux3
    aux[8] = aux4
    aux[9] = aux5
    return aux.join('')
}

function submitTarefa(){
    const toDay = new Date()
    const month = toDay.getMonth() + 1 < 10 ? 0 + (toDay.getMonth() + 1).toString() : toDay.getMonth() + 1
    const toDayString = `${toDay.getDate()}/${month}/${toDay.getUTCFullYear()}`
    
    if (tarefaTitle.value){
        const newTarefa = 
        {
            tarefa: tarefaTitle.value,
            dia: toDayString,
            diaDate: toDay,
            prazo: putItRight(tarefaDate.value),
            prazoDate: new Date(tarefaDate.value) || new Date(),
            descricao: descricao.value,
            done:false
        }
        socket.emit('newTarefa', newTarefa)
        tarefaDate.valueAsDate = new Date()
        tarefaTitle.value = ''
        descricao.value = ''
        popup.style.display = 'none'
    }else{
        window.alert('Qual o nome de sua Tarefa?')
    }
    
}

function deleteTarefa(trID,tarefa){
    if (window.confirm(`Certeza que deseja deletar a tarefa ${tarefa}?`)){
        socket.emit('deleteTarefa', trID)
    }
}

function openTarefa(index){
    const t = db.tarefas[index]
    popup2.style.display = 'block'
    document.querySelector('#shoT_Title').innerText = t.tarefa
    document.querySelector('#shoT_Descricao').innerText = t.descricao
    document.querySelector('#shoT_Prazo').innerText = `Prazo ${t.prazo}`
    document.querySelector('#shoT_Dia').innerText = `Dia ${t.dia}`
    

    const toDay = new Date()
    const month = toDay.getMonth() + 1 < 10 ? 0 + (toDay.getMonth() + 1).toString() : toDay.getMonth() + 1
    const toDayString = `${toDay.getDate()}/${month}/${toDay.getUTCFullYear()}`

    document.querySelector('#shoT_Hoje').innerText = `Hoje ${toDayString}`
    const dif = diffDates(new Date(t.prazoDate), toDay)
    document.querySelector('#shoT_Title').style.background = t.done ? 'rgb(174, 255, 178)' : 'rgb(255, 174, 174)'
    document.querySelector('#shoT_TempoRestante').style.background = t.done ? 'rgb(174, 255, 178)' : 'rgb(255, 174, 174)'
    if(dif < 0){
        if (Math.abs(dif) == 1){
            document.querySelector('#shoT_TempoRestante').innerText = `Já se passou um dia`
        }else{
            document.querySelector('#shoT_TempoRestante').innerText = `Já se passaram ${Math.abs(dif)} dias`
        }
        
    }else{
        if (Math.abs(dif) == 1) {
            document.querySelector('#shoT_TempoRestante').innerText = `Resta um dia`
        } else if (dif == 0) {
            document.querySelector('#shoT_TempoRestante').innerText = `Hoje é o prazo`
        }else{
            document.querySelector('#shoT_TempoRestante').innerText = `Restam ${Math.abs(dif)} dias`
        }
        document.querySelector('#shoT_Title').style.background = t.done ? 'rgb(174, 255, 178)' : 'rgb(255, 247, 174)'
        document.querySelector('#shoT_TempoRestante').style.background = t.done ? 'rgb(174, 255, 178)' : 'rgb(255, 247, 174)'
    }

}

function checkUncheck(index){
    socket.emit('checkUncheck',index)
}

function diffDates(dateOne, dateTwo) {
    if (typeof dateTwo === 'undefined') {
        dateTwo = new Date();
    }
    return Math.ceil((dateOne.getTime() - dateTwo.getTime()) / (1000 * 60 * 60 * 24))
}

function hoverADD(){
    document.querySelector('#svgtitle').style.opacity = 1
    document.querySelector('#svgtitle').style.transition = '0.2s ease, margin-left 0.7s ease, background-color 2s'
    document.querySelector('#svgtitle').style.backgroundColor = '#faa7a7'
    document.querySelector('#svgtitle').style.marginLeft = '15px'
}
function nothoverADD(){
    document.querySelector('#svgtitle').style.opacity = 0
    document.querySelector('#svgtitle').style.marginLeft = '0px'
    document.querySelector('#svgtitle').style.backgroundColor = '#faa7a700'
    document.querySelector('#svgtitle').style.transition = '2s ease 1s, margin-left 0.7s ease, background-color 2s'
}

window.addEventListener('keypress',evt => {
    const key = evt.key
    if ((key === 'a' || key === 'A') && popup.style.display != 'block' ){
        popupAddClicked()
    }
    if (key === 'Enter' && popup.style.display == 'block'){
        submitTarefa()
    }
})

const poputTutorial = document.querySelector('#popup-tutorial')
poputTutorial.addEventListener('click', event => {
    const classNameOfClickedElement = event.target.classList[0]
    const classNames = ['popup-close', 'popup-wrapper']
    const shouldClosePopup = classNames.some(className => className === classNameOfClickedElement)
    if (shouldClosePopup) {
        poputTutorial.style.display = 'none'
    }
})
function showTutorial() {
    poputTutorial.style.display = 'block'
}

function comoUsarShow() {
    document.querySelector('#buttonComoUsar').style.transition = 'opacity 0.5s, box-shadow 1s, background-color 1s , border-radius 500ms'
    document.querySelector('#buttonComoUsar').style.opacity = '1'
}
function comoUsarHide() {
    document.querySelector('#buttonComoUsar').style.transition = 'opacity 6s, box-shadow 1s, background-color 1s , border-radius 500ms'
    document.querySelector('#buttonComoUsar').style.opacity = '0'
}
window.document.addEventListener('mousemove', (event) => {
    let y = event.clientY / innerHeight;
    let x = event.clientX / innerWidth;
    console.log()
    if (y < 0.1 && x < 0.5) {
        comoUsarShow()
    } else {
        comoUsarHide()
    }
})