import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot,
         query, orderBy, where, addDoc, serverTimestamp, doc, deleteDoc, 
} from 'firebase/firestore';
import { toDate, add, format, differenceInCalendarDays, sub} from 'date-fns';

  const firebaseConfig = {
    apiKey: "AIzaSyCvVNtG9PRYBZo4DPvxDmaXad0HRDMt4aI",
    authDomain: "todo-4c42d.firebaseapp.com",
    projectId: "todo-4c42d",
    storageBucket: "todo-4c42d.appspot.com",
    messagingSenderId: "899447667299",
    appId: "1:899447667299:web:8a6729fbc276d9074a1656"
  };

  initializeApp(firebaseConfig);

  class TODO{
    constructor(){
      this.db = getFirestore();
      this.colRef = collection(this.db, 'toDoLista');
      this.date = new Date();
      this.zadanka = document.querySelector('.task-list');
      this.render;
      this.headerUpdate = document.querySelector('.yy');
    }
  
    getTasks(callback){
      this.render = onSnapshot(this.colRef, snapshot => {
        snapshot.docs.forEach(e => {
          callback(this.zadanka, e.data().zadanie, e.data().when, e.id);
        })
      })
    }


    renderTasks(zadanka, zad, when, ID){
      if(when){

          const ss = differenceInCalendarDays(when.toDate(), this.date);  // porównanie dnia zadania z aktualnym dniem metoda z date-fns
         
        if(ss === 0){
          zadanka.innerHTML += `
            <li class="kk list-group-item d-flex justify-content-between align-middle">
              <div>
                <span class="fw-bold fs-5">${zad}</span>
                <div class="fw-light fs-6">Deadline hour: ${format(when.toDate(), 'HH:mm')}</div>
                <div class='ID d-none'>${ID}</div>
              </div>

              <div class="done">
                <i class="bi bi-check-circle"><span> Click if done</span></i>
              </div>
            </li>

            `         // html template z listą zadań w aktualnym dniu
        };
      }; 
    }

    updateDay(ee){
      this.date = ee;
      this.render();
      this.clear(this.zadanka);
      this.headerUpdate.textContent = `Your tasks for the day ${format(ee, 'dd MMMM')}:`;
    }

    clear(e){
      e.innerHTML = ''; // czyszczenie UI z zadań;
    }

    adder(zad, when){
      addDoc(this.colRef, {
        zadanie: zad.charAt(0).toUpperCase() + zad.slice(1),
        when: when,
      }
      )
    }

    deleter(docRef){
      deleteDoc(docRef)
    }

  }

  const list1 = new TODO();
  list1.getTasks( (zadanka, e1, e2, e3) => {
    list1.headerUpdate.textContent = `Your tasks for the day ${format(list1.date, 'dd MMMM')}:`
    list1.renderTasks(zadanka, e1, e2, e3);

  });

///////////////////////////////// Adding events to DOM  ////////////////////////////////////

const nextDayButton = document.querySelector('.next');
const previousDayButton = document.querySelector('.previous');

//////////////////////////////////////NEXT DAY////////////////////////

nextDayButton.addEventListener('click', (e) => {
  e.preventDefault();

        const ee = add(list1.date, { days: 1 }); // add 1 day to actual day with method FNS
        list1.updateDay(ee);
        console.log("Day Added", ee);
        list1.getTasks( (zadanka, e1, e2, e3) => {
        list1.renderTasks(zadanka, e1, e2, e3)

  });
});

///////////////////////////////////PREV DAY/////////////////////////////

previousDayButton.addEventListener('click', (e) => {
e.preventDefault();

const ee = sub(list1.date, { days: 1 }); // substract 1 day to actual day with method FNS
list1.updateDay(ee);
console.log("Day substracted", ee);
list1.getTasks( (zadanka, e1, e2, e3) => {
  list1.renderTasks(zadanka, e1, e2, e3);
});
});

///////////////////////////////DODAWANIE ZADAŃ/////////////////////////

const adder = document.querySelector('.add-task');

adder.addEventListener('submit', (e) => {
  e.preventDefault();
  list1.clear(list1.zadanka);
  const godzina = new Date(adder.date.value);
  const newZadanko = e.target.add.value.trim();
  list1.adder(newZadanko, godzina);
  adder.reset();
  
});
//////////////////////////////USUWANIE ZADAŃ/////////////////////////////
const kkk = document.querySelector('.task-list');
    
kkk.addEventListener('click', (e) => {

    if(e.target.classList.contains('bi')){

      const eef = Array.from(document.getElementsByClassName('ID'))[0].textContent;
      const docRef = doc(list1.db, 'toDoLista', eef);
      list1.clear(list1.zadanka);
      list1.deleter(docRef);
    
    }
});

//////////////////////IMPORT API POGODY Z INNEGO PLIKU////////////////
import { pogodaKret } from './weather_class_and_commands.js';

pogodaKret.getWeather()
.then( (data) => pogodaKret.updateWeatherUI(data))
.catch( err => console.log(err));