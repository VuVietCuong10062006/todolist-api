let todos;

// 4->1000

// Truy cập
const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const btnUpdate = document.getElementById("btn-update");
btnUpdate.style.display = "none";

// API lấy danh sách công việc
let getTodos = async () => {
  try {
    let res = await axios.get("/todos");
    todos = res.data;
    renderTodo(todos);
  } catch (error) {
    console.log(error);
  }
};
const renderTodo = (arr) => {
  todoListEl.innerHTML = "";
  // Kiểm tra danh sách công việc có trống hay không
  if (arr.length == 0) {
    todoListEl.innerHTML = `<p class="todos-empty">Không có công việc nào trong danh sách</p>`;
    return;
  }
  // Hiển thị danh sách
  let html = "";
  arr.forEach((t) => {
    html += `
            <div class="todo-item ${t.status ? "active-todo" : ""}">
                <div class="todo-item-title">
                    <input 
                        type="checkbox" ${t.status ? "checked" : ""} 
                        onclick="toggleStatus(${t.id})"
                    />
                    <p id=${t.id}>${t.title}</p>
                </div>
                <div class="option">
                    <button class="btn btn-update" onclick="getTitle(${t.id})">
                        <img src="./img/pencil.svg" alt="icon" />
                    </button>
                    <button class="btn btn-delete" onclick="deleteTodo(${
                      t.id
                    })">
                        <img src="./img/remove.svg" alt="icon" />
                    </button>
                </div>
            </div>
        `;
  });
  todoListEl.innerHTML = html;
};

// Xóa công việc
const deleteTodo = async (id) => {
  // Lọc ra các cv khác id của công việc muốn xóa
  try {
    // Xóa trục tiếp trên server
    await axios.delete(`/todos/${id}`);
    todos = todos.filter((todo) => todo.id != id);
    renderTodo(todos);
  } catch (error) {
    console.log(error);
  }

  // Hiển thị lại trên giao diện
};
// Thay đổi trạng thái công việc
const toggleStatus = async (id) => {
  try {
    // Lấy ra cv cần thay đổi
    let todo = todos.find((todo) => todo.id == id);

    // Thay đổi trạng thái của cv đó : true -> false , false -> true
    todo.status = !todo.status;
    // Gọi API
    await axios.put(`/todos/${id}`, todo);
    renderTodo(todos);
    // Hiển thị lên trên giao diện
  } catch (error) {
    console.log(error);
  }
};

// Thêm công việc
const addTodo = async () => {
  try {
    // Lấy ra dữ liệu trong ô input
    let title = todoInputEl.value;

    // Kiểm tra xem tiêu đề có trống hay không
    if (title == "") {
      alert("Tiêu đề công việc không được để trống");
      return;
    }
// Tạo công việc mới
    let newTodo = {
      title: title,
      status: false,
    };
    // Gọi API tạo mới
    let res = await axios.post("/todos", newTodo);
    // Thêm cv mới vào mảng để quản lý
    todos.push(res.data);
    renderTodo(todos);

    todoInputEl.value = "";
  } catch (error) {
    console.log(error);
  }
};

// Thêm công việc bằng nút "THÊM"
btnAdd.addEventListener("click", () => {
  addTodo();
});

// // Thêm công việc bằng phím Enter
// todoInputEl.addEventListener("keydown", (event) => {
//   if (event.keyCode == 13) {
//     addTodo();
//   }
// });


// update 
let idUpdate = null
let getTitle = (id) =>{
    let tittle
    let todo = todos.find(todo => todo.id == id)
    tittle = todo.title
    todoInputEl.value = tittle
    todoInputEl.focus()
    idUpdate = id
    btnAdd.style.display = 'none'
    btnUpdate.style.display = 'inline-block'
}

btnUpdate.addEventListener('click',async (e) =>{
    try {
      let newTittle = todoInputEl.value
      let todo = todos.find(todo => todo.id == idUpdate)
      todo.title = newTittle
      await axios.put(`/todos/${idUpdate}`, todo)
      renderTodo(todos)
      todoInputEl.value = '' 
      btnAdd.style.display = 'inline-block'
      btnUpdate.style.display = 'none'
    } catch(error){
      console.log(error)
    }
})

// lọc công việc theo trạng thái 
Array.from(todoOptionEls).forEach(input =>{
    input.addEventListener('change', async () =>{
      try{
        let option = input.value
        let todoFileter = []
        switch(option){
            case 'all':{
              todoFileter = await axios.get("http://localhost:3000/todos")
              break
            }
            case 'active':{
              todoFileter = await axios.get("http://localhost:3000/todos?status=true")
              break
            }
            case 'unactive':{
              todoFileter = await axios.get("http://localhost:3000/todos?status=false")
              break
            }
            default :{
              todoFileter = await axios.get("http://localhost:3000/todos")
              break
            }
        }

        renderTodo(todoFileter.data)

      } catch(error){
        console.log(error)
      }
        
    })
})
getTodos();
