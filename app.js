let section = document.querySelector("section");
let add = document.querySelector("form button");

add.addEventListener("click",e=>{
    //prevent form from being submitted
    e.preventDefault();

    //get the input values
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
    
    //Check format of input values
    if (form.children[0].value == ""){
        alert("請輸入待辦內容");
        return;
    }else if (form.children[1].value =="" || form.children[2].value ==""){
        alert("請輸入月份與日期");
        return;
    }else if (form.children[1].value>12 || form.children[1].value<1 || form.children[2].value>31 || form.children[2].value<1){
        alert("請輸入正確日期格式");
        return;
    }

    //create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = `${todoMonth} / ${todoDate}`;
    todo.appendChild(text);
    todo.appendChild(time);

    //create check and bin
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = `<i class="fa-regular fa-circle-check"></i>`;
    completeButton.addEventListener("click", e=>{
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    trashButton.addEventListener("click", e =>{
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", e =>{

            // remove from local storage at the same time which HTML text has been removed.
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item,index) => {
                if (item.todoText == text){
                    myListArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(myListArray));
                }
            })
            
            todoItem.remove();
        })
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    //create an object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    //Storage data into an array of objects
    let myList = localStorage.getItem("list");
    if (myList == null){
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    form.children[0].value = ""; //Clear the text input
    section.appendChild(todo);
})

loadData();

function loadData(){
    let myList = localStorage.getItem("list");
    if (myList !== null ){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {

            //create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("P");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = `${item.todoMonth} / ${item.todoDate}`
            todo.appendChild(text);
            todo.appendChild(time);

            //create check and bin icon
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = `<i class="fa-regular fa-circle-check"></i>`;
            completeButton.addEventListener("click", e=>{
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            })

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
            trashButton.addEventListener("click", e =>{
                let todoItem = e.target.parentElement;

                todoItem.style.animation = "scaleDown 0.3s forwards";
                todoItem.addEventListener("animationend", e =>{
                    // remove from local storage at the same time which HTML text has been removed.
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item,index) => {
                        if (item.todoText == text){
                            myListArray.splice(index,1);
                            localStorage.setItem("list",JSON.stringify(myListArray));
                        }
                    })

                    todoItem.remove();
                })
            })

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            todo.style.animation = "scaleUp 0.3s forwards";

            section.appendChild(todo);

        });
    }
}



function mergeTime (ary1, ary2){
    let result = [];
    let i = 0;
    let j = 0;

    while (i < ary1.length && j < ary2.length){
        if (Number(ary1[i].todoMonth) > Number(ary2[j].todoMonth)){
            result.push(ary2[j]);
            j++;
        } else if (Number(ary1[i].todoMonth) < Number(ary2[j].todoMonth)){
            result.push(ary1[i]);
            i++;
        } else if (Number(ary1[i].todoMonth) = Number(ary2[j].todoMonth)){
            if (Number(ary1[i].todoDate) > Number(ary2[j].todoDate)){
                result.push(ary2[j]);
                j++;
            } else {
                result.push(ary1[i]);
                i++;
            }
        }
    }

    while (i < ary1.length){
        result.push(ary1[i]);
        i++;
    }

    while (j < ary2.length){
        result.push(ary2[j]);
        j++;
    }

    return result;
}

function mergeSort (ary) {
    if (ary.length === 1) {
        return ary;
    } else {
        let middle = Math.floor(ary.length / 2);
        let right = ary.slice(0, middle);
        let left = ary.slice(middle,ary.length);
        return mergeTime(mergeSort(right),mergeSort(left));
    }
}

console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", e =>{
    //Sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }
    //Load data
    loadData();
})