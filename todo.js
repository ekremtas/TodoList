// Sayfamdaki Elementlere kolay erişim için atadım.

const FirsCardBody = document.querySelectorAll(".card-body")[0];
const SecondCardBody = document.querySelectorAll(".card-body")[1];
const Form = document.querySelector("#todo-form");
const FormInput = document.querySelector("#todo");
const SearchInput = document.querySelector("#filter");
const List = document.querySelector(".list-group");
const ClearAllButton = document.querySelector("#clear-todos");

MyAddEventListener();

function MyAddEventListener(){
    // ekleme yapma fonksiyonumuz formumuzda submit oldugunda calısıyor.
    Form.addEventListener("submit",addTodo);
    // Sayfamız yüklenmesi bittiğinde çalışıyor ve local storage de degerimiz varsa ekrana listemize yazıyor.
    document.addEventListener("DOMContentLoaded",LoadAllTodosToUI);
    // Listemizdeki "x" işaretine dokundugumuz elemanı hem ekrandan hemde localStorage den silmemizi saglıyor.
    SecondCardBody.addEventListener("click",DeleteTodo);
    // Burda Todolarımızı filtreleme işlemi yapıyoruz, search input degerinde deger girildiğinde calısan event imizi yazıyoruz.
    SearchInput.addEventListener("keyup",SearhTodo);
    // Tüm todo ları silmek için clikc listener oluşturuyorum.
    ClearAllButton.addEventListener("click",ClearAll);


}

function ClearAll(){
    if(confirm("Tüm todoları silmek istediğinize emin misiniz ?")){
        while (List.firstElementChild != null) {
            
            List.removeChild(List.firstElementChild);
        }

    localStorage.removeItem("todos"); 
    }


}

//serialize-sıkıştırma algoritmaları h almak çok büyük 2 veriyi kıyaslama cashe kontrol
function SearhTodo(e){
    // inputta keyup aldugunda içindeki degeri alıp kucuk harfe ceviriyoruz.
    let SearchValue = e.target.value.toLowerCase();
    // list degerlerimizi alıyoruz cünkü text contentlerini alarak karsılastırma yapıcaz.
    let Lists = document.querySelectorAll(".list-group-item");
    
    // Lists de bulunan list elemanlarının text content degerlerini teker teker kontrol ediyoruz.
    Lists.forEach(function(item){
        // gelen item'ın içindeki text content'e erişiyoruz. ve içinde büyük harf var ise küçültüyoruz.
        let ListText = item.textContent.toLowerCase();
        // indexof() methodu ile içinde deger gecmiyorsa -1 degerimizi alıyoruz.
        if(ListText.indexOf(SearchValue)=== -1){
            // degerimizi ekrandan kaldırıyoruz.
            item.setAttribute("style","display : none !important");
        }
        else{
            // degerimizi ekranda görünür hale getiriyoruz.
            item.setAttribute("style","display : block");
        }

    });


}

function addTodo(e){

    let newValue = FormInput.value.trim();
    
    if(newValue === ""){
        // eger deger girilmezise ekranda alert ile uyarıyoruz ve işlem yapmıyoruz.
        showAlert("danger","Lütfen Bir Deger Giriniz !!!");
    }
    else{
        // EKlediğimiz degerlerin ekranda olusması için olustuddugum function
        addTodoUI(newValue);
        // Eklediğimiz degerleri Local Storage'a eklemek için gittiğimiz fonksiyon
        addTodotoStorage(newValue);
        // degerimizin dogru girilmesi uzerine alert.
        showAlert("success","Degeriniz Basarıyla Kaydedildi.");

    }


    //Submit işlemi yaptıgımızda sayfayı yenilememesi için bi degeri ekliyoruz.
    e.preventDefault();
}

function DeleteTodo(e){
    // e.target.clasName tıkladıgımız elemanın clas name ine ulasıyoruz.
    if(e.target.className==="fa fa-remove"){
        // ulaştıgımız element ile list parent ına erişip ekrandan silme işlemini yapıyoruz.
        e.target.parentElement.parentElement.remove();
        showAlert("info","Başarılı Bir Şekilde Silinmiştir.");
        // <li> elementimizin silinmesi için adını gönderiyoruz.
        DeleteTodoLocalStorage(e.target.parentElement.parentElement.textContent);

    }


}

function DeleteTodoLocalStorage(deleteValue){
    // todos arrayimizin degerlerini alıyoruz.
    let todos = getTodoFromStorage();
    // todos degerlerimiz uzerinde gezinip text ile uyusan degerimizi bulup (splice) ile arrayden siliyoruz.
    todos.forEach(function(e,index){
        if(e === deleteValue){
            todos.splice(index,1);
        }    
    
    })
    // Degeri sildikten sonra arrayimizi local storag ye gönderiyoruz.
    localStorage.setItem("todos",JSON.stringify(todos));

}

function LoadAllTodosToUI(){
    // local storagede kayıtlı olan degerlerimizi alıyoruz.
    let todos = getTodoFromStorage();
    // aldıgımız degerleri teker teker daha önceden ekrana list eklemesi yapan function'ımız ile list'imize ekliyoruz.
    
    todos.forEach(function(todo){
        addTodoUI(todo);
        
    });

}

function addTodotoStorage(value){
    // getfromstorage içindeki todos arrayini alıyoruz.
    let todos = getTodoFromStorage();
    // aldıgımız veya olusan todos arrayine degerimizi ekliyoruz.
    todos.push(value);
    //degeri arrayimizin sonuna ekledikten sonra local storage'ye JSON.strngify komutu ile geri gönderiyoruz.
    localStorage.setItem("todos",JSON.stringify(todos));



}

function getTodoFromStorage(){
     // degerimizi tanımlıyoruz.
     let todos;
     // Local Storage'ımızda todos tanımlı mı diye bakıyoruz tanımlı degilse yeni bir tane olusturuyoruz
     // ===null degeri koyarsak todos degeri tanımlanmdaıgında hata veriyor ama Basına ! ile kontrol yaptıgımızda hata düzeliyor.
     if(!localStorage.getItem("todos")){
         todos= [];
     }
     // todos Eger Tanımlı ise Array oarak kayıt ettiğimiz için JSON.parse methodu ile alıyoruz.
     else{
         todos = JSON.parse(localStorage.getItem("todos"));
     }
 
     return todos;
}

function showAlert(value,message){
    /* 
        Show alert olusturuyoruz ve gelen value ve message göre degeri ve rengi degisecek.
        <div class="alert alert-danger" role="alert">
            TEXT...
        </div> 
    */

    const AlertDiv = document.createElement("div");
    AlertDiv.className =`mt-3 alert alert-${value}`;
    AlertDiv.textContent=message;

    // İLk Card-body bölümümüze Div için olusturdugumuz alert'i ekliyoruz.
    FirsCardBody.appendChild(AlertDiv);

    // oluşan alert'in ekranda ne kadar süre kalacagını ve sonrasında silinmesi için oluşturdugumuz setTimeout methodu
    
    setTimeout(function(){
        AlertDiv.remove();
    },1000);
}


function addTodoUI(newValue){

    /*  Yeni eklenen degerimizi ekranada eklemek için burada listemizin elemanını oluşturup List'imize ekliyoruz.
    <li class="list-group-item d-flex justify-content-between">
        Todo 1
            <a href = "#" class ="delete-item">
                <i class = "fa fa-remove"></i>
            </a>
    </li>*/

    //Yukarıdaki listemizin elementini oluşturup class ını belirtiyoruz.
    const ListItem = document.createElement("li");
    ListItem.className="list-group-item d-flex justify-content-between";
    //List içine koyacagımız Link elemanını olusturuyoruz.
    const LinkItem = document.createElement("a");
    LinkItem.className = "delete-item";
    LinkItem.href = "javascript:;";
    //içine sadece bu html kodunu ekleyecegimiz için innerHTML ile ekliyoruz.Böylece Html etiketini html kodu olarak okuyor.
    LinkItem.innerHTML = "<i class = 'fa fa-remove'></i>";

    ListItem.appendChild(document.createTextNode(newValue));
    ListItem.appendChild(LinkItem);

    List.appendChild(ListItem);
    
    FormInput.value="";

}
